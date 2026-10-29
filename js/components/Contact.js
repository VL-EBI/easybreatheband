/* Contact component */
EBB.define("Contact", (function () {
class Component extends DCLogic {
  state = { name: '', email: '', topic: 'General question', message: '', status: 'idle', invalid: {} };

  // ===== Contact configuration (pending) =====
  config() {
    return {
      contactEndpoint: '',   // form endpoint; success shows only on a confirmed response
      instagramUrl: '', tiktokUrl: '', youtubeUrl: ''
    };
  }

  send(e) {
    if (e && e.preventDefault) e.preventDefault();
    const cfg = this.config();
    if (!cfg.contactEndpoint || this.state.status === 'loading') return;
    const s = this.state;
    const invalid = {
      name: !s.name.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim()),
      message: !s.message.trim()
    };
    if (invalid.name || invalid.email || invalid.message) { this.setState({ invalid: invalid, status: 'invalid' }); return; }
    this.setState({ invalid: {}, status: 'loading' });
    fetch(cfg.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: s.name, email: s.email, topic: s.topic, message: s.message }) })
      .then((r) => { if (!r.ok) throw new Error('failed'); this.setState({ status: 'success' }); })
      .catch(() => this.setState({ status: 'error' }));
  }

  renderVals() {
    const s = this.state;
    const cfg = this.config();
    const connected = !!cfg.contactEndpoint;
    let msg = 'Contact form coming soon.', msgClass = '';
    if (connected) {
      msg = '';
      if (s.status === 'invalid') { msg = 'Please add your name, a valid email address and a message.'; msgClass = 'msg--error'; }
      if (s.status === 'loading') msg = 'Sending…';
      if (s.status === 'error') { msg = 'Something went wrong. Please try again.'; msgClass = 'msg--error'; }
      if (s.status === 'success') { msg = 'Thanks — your message is on its way.'; msgClass = 'msg--success'; }
    }
    const field = (k) => (e) => this.setState({ [k]: e.target.value });
    const social = [
      { label: 'Instagram', url: cfg.instagramUrl },
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
      sendDisabled: !connected || s.status === 'loading',
      sendLabel: s.status === 'loading' ? 'Sending…' : 'Send message',
      msg: msg, msgClass: msgClass,
      social: social, hasSocial: social.length > 0, noSocial: social.length === 0
    };
  }
}
return Component;
})());
