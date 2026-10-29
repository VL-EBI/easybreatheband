/* SiteHeader component */
EBB.define("SiteHeader", (function () {
class Component extends DCLogic {
  state = { menuOpen: false };
  renderVals() {
    const active = this.props.active || 'home';
    const links = [
      { key: 'music', label: 'Music', href: 'music.html' },
      { key: 'band', label: 'Meet the Band', href: 'band.html' },
      { key: 'about', label: 'About the Project', href: 'about.html' },
      { key: 'contact', label: 'Contact', href: 'contact.html' }
    ].map((l) => Object.assign({}, l, { current: l.key === active ? 'page' : undefined }));
    const open = this.state.menuOpen;
    return {
      links: links,
      homeCurrent: active === 'home' ? 'page' : undefined,
      menuOpen: open,
      menuClosed: !open,
      menuExpanded: open ? 'true' : 'false',
      menuLabel: open ? 'Close menu' : 'Open menu',
      toggleMenu: () => this.setState({ menuOpen: !open }),
      closeMenu: () => this.setState({ menuOpen: false })
    };
  }
}
return Component;
})());
