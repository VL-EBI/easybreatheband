/* SiteConsent component */
EBB.define("SiteConsent", (function () {
class Component extends DCLogic {
  // ===== Site analytics (no third parties), on by default with an easy opt-out =====
  // Events go only to Easy Breathe's own collection service (Cloudflare Worker, set in js/ebb-config.js).
  // Off when the visitor turns it off ("Analytics choices" in the footer), or when the browser sends
  // Global Privacy Control (unless the visitor turns it back on here). While endpoint is empty, nothing runs.
  config() {
    return {
      // set analyticsEndpoint in js/ebb-config.js on the published site, e.g. 'https://stats.easybreathe.com'
      endpoint: ((typeof window !== 'undefined' && window.EBB_CONFIG) || {}).analyticsEndpoint || '',
      site: 'easybreatheband',
      storageKey: 'ebb-analytics'   // remembers "yes" or "no" in this browser
    };
  }

  state = { choice: null, gpc: false, reopened: false };

  readChoice() {
    try { return localStorage.getItem(this.config().storageKey); } catch (e) { return null; }
  }

  saveChoice(v) {
    try { localStorage.setItem(this.config().storageKey, v); } catch (e) { /* private window: the choice lasts for this page only */ }
  }

  componentDidMount() {
    if (this.props.demo) return;  // canvas preview: show the bar, never track
    const cfg = this.config();
    if (!cfg.endpoint) return;
    document.documentElement.setAttribute('data-ebb-analytics', 'on');  // reveals the footer's "Analytics choices" link
    this.onReopen = () => {
      this.setState({ reopened: true });
      setTimeout(() => { const h = document.getElementById('sk-title'); if (h) h.focus(); }, 0);
    };
    this.onKey = (e) => { if (e.key === 'Escape' && this.state.reopened) this.setState({ reopened: false }); };
    window.addEventListener('ebb:consent-open', this.onReopen);
    window.addEventListener('keydown', this.onKey);
    const gpc = navigator.globalPrivacyControl === true;  // browser privacy signal: off unless turned on here
    const saved = this.readChoice();
    const choice = saved === 'yes' || saved === 'no' ? saved : (gpc ? 'no' : 'yes');
    this.setState({ choice: choice, gpc: gpc });
    if (choice === 'yes') this.startTracking();
  }

  componentWillUnmount() {
    if (this.onReopen) window.removeEventListener('ebb:consent-open', this.onReopen);
    if (this.onKey) window.removeEventListener('keydown', this.onKey);
  }

  accept() {
    this.saveChoice('yes');
    this.setState({ choice: 'yes' });
    this.startTracking();
  }

  decline() {
    this.saveChoice('no');
    this.setState({ choice: 'no' });
    this.stopTracking();
  }

  // ----- tracker -----
  startTracking() {
    if (window.__ebbTracker) { window.__ebbTracker.on = true; return; }
    const cfg = this.config();
    const T = window.__ebbTracker = { on: true, queue: [] };
    const rnd = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now();
    let sid = null;
    try { sid = sessionStorage.getItem('ebb-sid'); if (!sid) { sid = rnd(); sessionStorage.setItem('ebb-sid', sid); } } catch (e) { sid = rnd(); }
    const pid = rnd();
    const page = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/';
    const vw = innerWidth < 700 ? 'mobile' : innerWidth < 1100 ? 'tablet' : 'desktop';
    const clip = (s, n) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n);
    const send = (type, data) => {
      if (!T.on) return;
      T.queue.push({ type: type, ts: Date.now(), sid: sid, pid: pid, path: page, vw: vw, data: data || {} });
      if (T.queue.length >= 20) flush();
    };
    const flush = () => {
      if (!T.queue.length) return;
      const body = JSON.stringify({ site: cfg.site, events: T.queue.splice(0, 50) });
      const url = cfg.endpoint.replace(/\/$/, '') + '/collect';
      // text/plain keeps this a "simple" request (no CORS preflight); the server parses it as JSON.
      const blob = new Blob([body], { type: 'text/plain' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(url, blob))) {
        fetch(url, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain' }, keepalive: true, mode: 'cors' }).catch(() => {});
      }
    };
    T.send = send;
    T.flush = flush;

    // page view
    const params = new URLSearchParams(location.search);
    let ref = '';
    try { if (document.referrer) { const r = new URL(document.referrer); ref = r.host === location.host ? 'internal:' + (r.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') || '/') : r.host; } } catch (e) {}
    send('pageview', { title: clip(document.title, 120), ref: ref, utm_source: clip(params.get('utm_source'), 60), utm_medium: clip(params.get('utm_medium'), 60), utm_campaign: clip(params.get('utm_campaign'), 60) });

    // clicks on links and buttons: label, destination and position on the page (as % of page size)
    document.addEventListener('click', (e) => {
      const el = e.target && e.target.closest && e.target.closest('a,button,[role="button"],summary');
      if (!el || el.closest('.sk')) return;
      const doc = document.documentElement;
      const label = el.getAttribute('data-track') || el.getAttribute('aria-label') || el.textContent;
      const href = el.tagName === 'A' ? (el.getAttribute('href') || '').split('?')[0] : '';
      const sec = el.closest('section,header,footer,aside,nav');
      send('click', {
        label: clip(label, 80), href: clip(href, 200), el: el.tagName.toLowerCase(),
        area: sec ? clip(sec.getAttribute('aria-labelledby') || sec.getAttribute('aria-label') || sec.className.split(' ')[0] || sec.tagName.toLowerCase(), 60) : '',
        x: Math.round((e.pageX / Math.max(1, doc.scrollWidth)) * 1000) / 10,
        y: Math.round((e.pageY / Math.max(1, doc.scrollHeight)) * 1000) / 10
      });
    }, true);

    // scroll depth (each milestone once per page view)
    const hit = {};
    let maxDepth = 0;
    const onScroll = () => {
      const doc = document.documentElement;
      const depth = Math.min(100, Math.round(((scrollY + innerHeight) / Math.max(1, doc.scrollHeight)) * 100));
      maxDepth = Math.max(maxDepth, depth);
      [25, 50, 75, 100].forEach((m) => { if (depth >= (m === 100 ? 98 : m) && !hit[m]) { hit[m] = 1; send('scroll', { depth: m }); } });
    };
    addEventListener('scroll', onScroll, { passive: true });
    setTimeout(onScroll, 500);

    // songs: play / pause / finished, plus 25-50-75% listening milestones per play
    let marks = {};
    addEventListener('ebb:audio', (e) => {
      const d = e.detail || {};
      if (!d.song || !d.how) return;
      if (d.how === 'play' && d.t < 1) marks = {};
      send('song', { song: d.song, action: d.how, t: Math.round(d.t || 0), dur: Math.round(d.dur || 0) });
    });
    addEventListener('ebb:audio-time', (e) => {
      const d = e.detail || {};
      if (!d.song || !d.dur) return;
      const pct = (d.t / d.dur) * 100;
      [25, 50, 75].forEach((m) => { const k = d.song + m; if (pct >= m && !marks[k]) { marks[k] = 1; send('song', { song: d.song, action: 'progress', pct: m }); } });
    });

    // time actually spent looking at the page, sent when the visitor leaves
    let visibleMs = 0, since = document.visibilityState === 'visible' ? Date.now() : 0, left = false;
    const leave = () => {
      if (left) return; left = true;
      if (since) visibleMs += Date.now() - since;
      send('leave', { seconds: Math.round(visibleMs / 1000), depth: maxDepth });
      flush();
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { if (since) { visibleMs += Date.now() - since; since = 0; } flush(); }
      else since = Date.now();
    });
    addEventListener('pagehide', leave);
    setInterval(flush, 5000);
  }

  stopTracking() {
    if (window.__ebbTracker) { window.__ebbTracker.queue = []; window.__ebbTracker.on = false; }
    try { sessionStorage.removeItem('ebb-sid'); } catch (e) {}
  }

  renderVals() {
    const st = this.state;
    const on = this.props.demo ? true : st.choice === 'yes';
    const offText = st.gpc && this.readChoice() !== 'no'
      ? 'Analytics are off because your browser sends a Global Privacy Control signal. Nothing about your visits is recorded. You can turn them on here if you like.'
      : 'Analytics are off in this browser. Nothing about your visits is recorded.';
    return {
      show: !!this.props.demo || st.reopened,
      statusLabel: on ? 'On' : 'Off',
      statusClass: on ? '' : 'is-off',
      bodyText: on
        ? 'We count visits, clicks and which songs get played so we know what people enjoy. It\u2019s anonymous, stays with Easy Breathe and is never used for ads.'
        : offText,
      toggleLabel: on ? 'Turn off' : 'Turn on',
      toggle: () => { if (this.props.demo) return; if (on) this.decline(); else this.accept(); },
      close: () => { if (!this.props.demo) this.setState({ reopened: false }); }
    };
  }
}
return Component;
})());
