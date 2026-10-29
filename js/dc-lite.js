/*!
 * dc-lite.js — tiny client-side renderer for the EBB site.
 * Renders <template id="tpl-Name"> markup using the matching component class
 * (registered with EBB.define). Supports {{holes}}, <sc-if>, <sc-for>,
 * <dc-import>, on* event bindings and stateful components (setState).
 * Updates are patched into the existing DOM, so focus and scroll are kept,
 * and server-rendered (prerendered) markup is reused on first load.
 */
(function () {
  'use strict';
  var registry = {};
  var instances = {};
  var mounted = [];
  var counter = 0;
  var scheduled = false;
  var rootName = null;
  var rootEl = null;

  function DCLogic(props) { this.props = props || {}; }
  DCLogic.prototype.setState = function (update) {
    var next = typeof update === 'function' ? update(this.state) : update;
    this.state = Object.assign({}, this.state, next);
    schedule();
  };
  DCLogic.prototype.forceUpdate = function () { schedule(); };
  window.DCLogic = DCLogic;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    Promise.resolve().then(function () { scheduled = false; render(); });
  }

  function get(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var v = scope, parts = path.split('.');
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function interp(str, scope) {
    var whole = str.match(/^\{\{([^}]*)\}\}$/);
    if (whole) return get(scope, whole[1]);
    return str.replace(/\{\{([^}]*)\}\}/g, function (m, p) { var v = get(scope, p); return v == null ? '' : v; });
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }

  function renderComponent(name, props, out) {
    var key = name + '#' + (counter++);
    var inst = instances[key];
    if (!inst) {
      var C = registry[name];
      if (!C) { console.warn('dc-lite: unknown component', name); return; }
      inst = new C(props);
      inst.props = props;
      instances[key] = inst;
      mounted.push(inst);
    }
    inst.props = props;
    var tpl = document.getElementById('tpl-' + name);
    var wrap = document.createElement('div');
    wrap.setAttribute('data-comp', name);
    wrap.style.display = 'contents';
    build(tpl.content, inst.renderVals(), wrap);
    out.appendChild(wrap);
  }

  function eventName(attr, el) {
    var ev = attr.slice(2).toLowerCase();
    if (ev === 'change' && el.tagName !== 'SELECT') return 'input';
    if (ev === 'doubleclick') return 'dblclick';
    return ev;
  }

  function build(node, scope, out) {
    var kids = node.childNodes;
    for (var i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (n.nodeType === 3) { out.appendChild(document.createTextNode(interp(n.textContent, scope))); continue; }
      if (n.nodeType !== 1) continue;
      var tag = n.tagName.toLowerCase();
      if (tag === 'sc-if') { if (interp(n.getAttribute('value'), scope)) build(n, scope, out); continue; }
      if (tag === 'sc-for') {
        var list = interp(n.getAttribute('list'), scope) || [];
        var as = n.getAttribute('as');
        for (var j = 0; j < list.length; j++) {
          var s = Object.assign({}, scope); s[as] = list[j]; s.$index = j;
          build(n, s, out);
        }
        continue;
      }
      if (tag === 'dc-import') {
        var props = {};
        for (var a = 0; a < n.attributes.length; a++) {
          var at = n.attributes[a];
          if (at.name === 'name' || at.name.indexOf('hint-') === 0) continue;
          props[camel(at.name)] = interp(at.value, scope);
        }
        renderComponent(n.getAttribute('name'), props, out);
        continue;
      }
      var el = n.namespaceURI === 'http://www.w3.org/2000/svg'
        ? document.createElementNS(n.namespaceURI, n.tagName)
        : document.createElement(n.tagName);
      el.__h = {};
      var pendingValue;
      for (var b = 0; b < n.attributes.length; b++) {
        var attr = n.attributes[b];
        var v = interp(attr.value, scope);
        if (/^on[a-z]/i.test(attr.name)) { if (typeof v === 'function') el.__h[eventName(attr.name, el)] = v; continue; }
        if (v === false || v == null) continue;
        if (attr.name === 'value') pendingValue = v;
        el.setAttribute(attr.name, v === true ? '' : v);
      }
      build(n, scope, el);
      if (pendingValue !== undefined) el.__v = String(pendingValue);
      out.appendChild(el);
    }
  }

  function bind(el) {
    if (!el.__h) return;
    el.__bound = el.__bound || {};
    Object.keys(el.__h).forEach(function (type) {
      if (el.__bound[type]) return;
      el.__bound[type] = true;
      el.addEventListener(type, function (e) { var fn = el.__h && el.__h[type]; if (fn) fn(e); });
    });
  }

  function syncValue(oldEl, val) {
    if (val === undefined) return;
    if (oldEl.value !== val && !(document.activeElement === oldEl && oldEl.type === 'range')) oldEl.value = val;
  }

  function patch(oldEl, newEl) {
    // attributes
    if (oldEl.nodeType === 1) {
      var oa = oldEl.attributes;
      for (var i = oa.length - 1; i >= 0; i--) { if (!newEl.hasAttribute(oa[i].name)) oldEl.removeAttribute(oa[i].name); }
      var na = newEl.attributes;
      for (var j = 0; j < na.length; j++) { if (oldEl.getAttribute(na[j].name) !== na[j].value) oldEl.setAttribute(na[j].name, na[j].value); }
      oldEl.__h = newEl.__h || {};
      bind(oldEl);
    }
    patchChildren(oldEl, newEl);
    if (newEl.__v !== undefined) syncValue(oldEl, newEl.__v);
  }

  function sameNode(a, b) {
    if (a.nodeType !== b.nodeType) return false;
    if (a.nodeType === 3) return true;
    return a.nodeType === 1 && a.tagName === b.tagName;
  }

  function patchChildren(oldParent, newParent) {
    var oldKids = Array.prototype.slice.call(oldParent.childNodes).filter(function (n) { return n.nodeType === 1 || n.nodeType === 3; });
    var newKids = Array.prototype.slice.call(newParent.childNodes);
    var i;
    for (i = 0; i < newKids.length; i++) {
      var nk = newKids[i], ok = oldKids[i];
      if (!ok) { oldParent.appendChild(adopt(nk)); continue; }
      if (!sameNode(ok, nk)) { oldParent.replaceChild(adopt(nk), ok); continue; }
      if (ok.nodeType === 3) { if (ok.nodeValue !== nk.nodeValue) ok.nodeValue = nk.nodeValue; continue; }
      patch(ok, nk);
    }
    for (; i < oldKids.length; i++) oldParent.removeChild(oldKids[i]);
  }

  // Moves a freshly built node into the live DOM, binding handlers and values.
  function adopt(node) {
    if (node.nodeType === 1) {
      var all = [node].concat(Array.prototype.slice.call(node.querySelectorAll('*')));
      all.forEach(function (el) { bind(el); if (el.__v !== undefined) el.value = el.__v; });
    }
    return node;
  }

  function render() {
    counter = 0;
    var fresh = document.createElement('div');
    renderComponent(rootName, {}, fresh);
    patchChildren(rootEl, fresh);
  }

  window.EBB = {
    define: function (name, cls) { registry[name] = cls; },
    start: function (name, el) {
      rootName = name;
      rootEl = el;
      render();
      mounted.forEach(function (m) { if (m.componentDidMount) { try { m.componentDidMount(); } catch (e) { console.error(e); } } });
    }
  };
})();
