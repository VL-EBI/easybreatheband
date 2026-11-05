/* Contact component */
EBB.define("Contact", (function () {
class Component extends DCLogic {
  state = { name: '', email: '', topic: 'General question', message: '', status: 'idle', invalid: {} };

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
      social: social, hasSocial: social.length > 0, noSocial: social.length === 0
    };
  }
}
return Component;
})());
