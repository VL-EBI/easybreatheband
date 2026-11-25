/* EBB site settings. Edit these values, then publish the site. */
window.EBB_CONFIG = {
  // EBB analytics service: Cloudflare Worker in Easy Breathe's account (no slash at the end).
  // Empty = analytics off: no consent bar, nothing recorded, and /analytics shows "not connected".
  analyticsEndpoint: 'https://ebb-site-data.easybreathe.workers.dev',

  // Easy Breathe newsletter in Klaviyo. Both are needed for the signup forms (Home and Contact) to work.
  // klaviyoCompanyId: your Klaviyo public API key / site ID (6 characters, Settings > API keys).
  // klaviyoListId: the ID of the list new subscribers should join (Lists & segments > your list > Settings).
  klaviyoCompanyId: 'UVDJsz',  // Klaviyo public API key / site ID
  klaviyoListId: 'XhWYAZ'      // Easy Breathe CPAP newsletter list (single opt-in)
};
