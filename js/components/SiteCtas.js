/* SiteCtas component */
EBB.define("SiteCtas", (function () {
class Component extends DCLogic {
  // ===== Easy Breathe destinations (shared by every page) =====
  // homeSleepTestUrl is a TEMPORARY prototype fallback: replace with the $150 offer page before public use.
  renderVals() {
    return {
      testUrl: 'https://easybreathe.com/',
      insuranceUrl: 'https://insurance.easybreathe.com/'
    };
  }
}
return Component;
})());
