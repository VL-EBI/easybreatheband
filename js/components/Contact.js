/* Contact component */
EBB.define("Contact", (function () {
class Component extends DCLogic {
  state = { name: '', email: '', topic: 'General question', message: '', status: 'idle', invalid: {}, nlEmail: '', nlStatus: 'idle' };

  // ===== Easy Breathe newsletter (Klaviyo) =====
  // Uses Klaviyo's public subscription API so the form keeps this design and no Klaviyo tracking script loads.
  // The IDs live in js/ebb-config.js on the published site (klaviyoCompanyId = public API key / site ID, klaviyoListId).
  klaviyo() {
    const c = (typeof window !== 'undefined' && window.EBB_CONFIG) || {};
    return { company: c.klaviyoCompanyId || '', list: c.klaviyoListId || '' };
  }

  subscribe(email) {
    const k = this.klaviyo();
    return fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + encodeURIComponent(k.company), {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json', 'revision': '2024-10-15' },
      body: JSON.stringify({ data: { type: 'subscription', attributes: { custom_source: 'easybreatheband.com', profile: { data: { type: 'profile', attributes: { email: email } } } }, relationships: { list: { data: { type: 'list', id: k.list } } } } })
    }).then((r) => { if (!r.ok) throw new Error('signup failed'); });
  }

  onSubscribe(e) {
    if (e && e.preventDefault) e.preventDefault();
    const k = this.klaviyo();
    if (!k.company || !k.list || this.state.nlStatus === 'loading') return;
    const email = (this.state.nlEmail || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.setState({ nlStatus: 'invalid' }); return; }
    this.setState({ nlStatus: 'loading' });
    this.subscribe(email)
      .then(() => this.setState({ nlStatus: 'success' }))
      .catch(() => this.setState({ nlStatus: 'error' }));
  }

  // ===== Contact configuration =====
  config() {
    return {
      contactEmail: 'easybreatheband@easybreathe.com',
      contactEndpoint: '',   // optional form endpoint; without one the form opens the visitor's email app
      instagramUrl: 'https://www.instagram.com/easybreatheband/', tiktokUrl: '', youtubeUrl: ''
    };
  }

  send(e) {
    if (e && e.preventDefault) e.preventDefault();
    const cfg = this.config();
    if (this.state.status === 'loading') return;
    const s = this.state;
    const invalid = {
      name: !s.name.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim()),
      message: !s.message.trim()
    };
    if (invalid.name || invalid.email || invalid.message) { this.setState({ invalid: invalid, status: 'invalid' }); return; }
    if (!cfg.contactEndpoint) {
      const subject = 'EBB website: ' + s.topic;
      const body = s.message.trim() + '\n\n— ' + s.name.trim() + ' (' + s.email.trim() + ')';
      window.location.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      this.setState({ invalid: {}, status: 'mailto' });
      return;
    }
    this.setState({ invalid: {}, status: 'loading' });
    fetch(cfg.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: s.name, email: s.email, topic: s.topic, message: s.message }) })
      .then((r) => { if (!r.ok) throw new Error('failed'); this.setState({ status: 'success' }); })
      .catch(() => this.setState({ status: 'error' }));
  }

  renderVals() {
    const s = this.state;
    const cfg = this.config();
    const connected = !!cfg.contactEndpoint;
    let msg = connected ? '' : 'Opens your email app with your message ready to send.', msgClass = '';
    if (s.status === 'invalid') { msg = 'Please add your name, a valid email address and a message.'; msgClass = 'msg--error'; }
    if (s.status === 'mailto') { msg = 'Your email app should open with your message. If it doesn’t, email ' + cfg.contactEmail + '.'; }
    if (s.status === 'loading') msg = 'Sending…';
    if (s.status === 'error') { msg = 'Something went wrong. Please try again.'; msgClass = 'msg--error'; }
    if (s.status === 'success') { msg = 'Thanks — your message is on its way.'; msgClass = 'msg--success'; }
    const field = (k) => (e) => this.setState({ [k]: e.target.value });
    const kl = this.klaviyo();
    const nlOn = !!(kl.company && kl.list);
    const social = [
      { label: 'Instagram · @easybreatheband', url: cfg.instagramUrl },
      { label: 'TikTok', url: cfg.tiktokUrl },
      { label: 'YouTube', url: cfg.youtubeUrl }
    ].filter((x) => !!x.url);
    return {
      name: s.name, email: s.email, topic: s.topic, message: s.message,
      onName: field('name'), onEmail: field('email'), onTopic: field('topic'), onMessage: field('message'),
      nameInvalid: s.invalid.name ? 'true' : 'false',
      emailInvalid: s.invalid.email ? 'true' : 'false',
      messageInvalid: s.invalid.message ? 'true' : 'false',
      onSend: (e) => this.send(e),
      sendDisabled: s.status === 'loading',
      sendLabel: s.status === 'loading' ? 'Sending…' : 'Send message',
      mailHref: 'mailto:' + cfg.contactEmail,
      mailText: cfg.contactEmail,
      msg: msg, msgClass: msgClass,
      social: social, hasSocial: social.length > 0, noSocial: social.length === 0,
      nlEmail: s.nlEmail,
      onNlEmail: (e) => this.setState({ nlEmail: e.target.value, nlStatus: s.nlStatus === 'invalid' || s.nlStatus === 'error' ? 'idle' : s.nlStatus }),
      onSubscribe: (e) => this.onSubscribe(e),
      nlInvalid: s.nlStatus === 'invalid' ? 'true' : 'false',
      nlDisabled: !nlOn || s.nlStatus === 'loading',
      nlBtn: s.nlStatus === 'loading' ? 'Signing up…' : 'Sign me up',
      nlMsg: !nlOn ? 'Email signup coming soon.' : s.nlStatus === 'invalid' ? 'Please enter a valid email address.' : s.nlStatus === 'loading' ? 'Signing you up…' : s.nlStatus === 'error' ? 'Something went wrong. Please try again.' : s.nlStatus === 'success' ? 'You’re signed up. Watch your inbox for the Easy Breathe newsletter.' : '',
      nlMsgClass: s.nlStatus === 'invalid' || s.nlStatus === 'error' ? 'nl-error' : s.nlStatus === 'success' ? 'nl-success' : ''
    };
  }
}
return Component;
})());
