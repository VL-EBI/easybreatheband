/* Privacy component */
EBB.define("Privacy", (function () {
class Component extends DCLogic {
  state = { hasChoices: false };
  componentDidMount() {
    // The button only works once analytics are connected (js/ebb-config.js).
    const cfg = (typeof window !== 'undefined' && window.EBB_CONFIG) || {};
    if (cfg.analyticsEndpoint) this.setState({ hasChoices: true });
  }
  renderVals() {
    return {
      hasChoices: this.state.hasChoices,
      openChoices: () => window.dispatchEvent(new CustomEvent('ebb:consent-open'))
    };
  }
}
return Component;
})());
