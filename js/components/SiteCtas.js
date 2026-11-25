/* SiteCtas component */
EBB.define("SiteCtas", (function () {
class Component extends DCLogic {
  // ===== Easy Breathe destinations (shared by every page) =====
  // homeSleepTestUrl is a TEMPORARY prototype fallback: replace with the $150 offer page before public use.
  renderVals() {
    // variant="insurance" drops the home sleep test card (for pages where visitors likely already use CPAP).
    const single = this.props.variant === 'insurance';
    return {
      showTest: !single,
      wrapClass: single ? 'is-single' : '',
      heading: single ? 'Using CPAP? Check your coverage.' : 'Ready for your own next step?',
      lede: single ? 'See what your insurance may cover for CPAP equipment and supplies.' : 'Interested in sleep apnea testing or checking your CPAP insurance coverage? Start here.',
      note: single ? 'This link opens Easy Breathe\'s website, where insurance information is handled.' : 'These links open Easy Breathe\'s website, where testing and insurance information is handled.',
      testUrl: 'https://easybreathe.com/',
      insuranceUrl: 'https://insurance.easybreathe.com/'
    };
  }
}
return Component;
})());
