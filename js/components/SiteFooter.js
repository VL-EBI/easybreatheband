/* SiteFooter component */
EBB.define("SiteFooter", (function () {
class Component extends DCLogic {
  // homeSleepTestUrl is a TEMPORARY prototype fallback: replace with the $150 offer page before public use.
  renderVals() {
    return {
      testUrl: 'https://easybreathe.com/',
      insuranceUrl: 'https://insurance.easybreathe.com/',
      storeUrl: 'https://easybreathe.com/'
    };
  }
}
return Component;
})());
