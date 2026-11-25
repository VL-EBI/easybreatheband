/* SiteSeason component */
EBB.define("SiteSeason", (function () {
class Component extends DCLogic {
  // Seasonal banner shown under the header on every page except the Thanksgiving page itself.
  // After the holiday, set show to false here and it disappears everywhere.
  state = { playing: false };

  // The sound bars move only while a song is playing on this page (the players announce it with an 'ebb:audio' event).
  componentDidMount() {
    this.onAudio = (e) => this.setState({ playing: !!(e.detail && e.detail.playing) });
    window.addEventListener('ebb:audio', this.onAudio);
    if (window.__ebbPlaying) this.setState({ playing: true });
  }

  componentWillUnmount() {
    if (this.onAudio) window.removeEventListener('ebb:audio', this.onAudio);
  }

  renderVals() {
    return { show: true, eqClass: this.state.playing ? 'is-playing' : '' };
  }
}
return Component;
})());
