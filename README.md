# EBB — Easy Breathe Band website

Static website for EBB, a fictional band and AI music project from Easy Breathe.
No build step and no dependencies: plain HTML, CSS and JavaScript that runs on GitHub Pages or any static host.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `music.html` | Music: player, setlist and full lyrics |
| `band.html` | Meet the Band, including the photo gallery (full-screen viewer) |
| `about.html` | About the Project (full story and disclosures) |
| `contact.html` | Contact |
| `404.html` | Page not found (also sends `/christmas/`, `/thanksgiving/` and other spellings to the Christmas page) |
| `privacy.html` | Privacy and analytics notice at `/privacy` (linked from every footer) |
| `analytics.html` | Locked analytics dashboard at `/analytics` (not linked; needs the access code) |
| `hold.html` | Forwards to the Christmas page, tagged as hold-music traffic (for the voiceover address `/hold`) |
| `christmas.html` | Christmas songs, lyrics and photos. Live at `/christmas` (GitHub Pages serves `.html` pages without the extension) |
| `thanksgiving.html` | Retired: forwards `/thanksgiving` (and the easybreathe.com redirect) to `/christmas`, keeping any link tag |

## Run it locally

Browsers block some features on `file://` pages, so serve the folder:

```bash
cd ebb-site
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish with GitHub Pages

1. Create a repository and push the contents of this folder to the root of the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<user-or-org>.github.io/<repo>/`.

The empty `.nojekyll` file tells GitHub Pages to serve the files as they are.

**404 page on a project site:** if the site lives under a repo path (`…github.io/<repo>/`), open `404.html` and uncomment the `<base href="/your-repo-name/">` line, replacing the name, so the 404 page can find its CSS and images from any URL. This step isn't needed with a custom domain or a `<user>.github.io` repository.

## Folder structure

```
assets/img/         group portraits, logos (cream + brown), textures, favicon
assets/img/gallery/ gallery and page photos (used on Meet the Band, Home, Music and About)
assets/img/members/ mask-on / mask-off portraits for each member (Meet the Band)
assets/img/christmas/ seasonal photos for the Christmas page
assets/audio/      song recordings (MP3)
css/               one stylesheet per page or shared part
js/dc-lite.js      small renderer that powers templates and interactivity
js/components/     one script per page or shared part (content, data and behavior)
```

Shared parts used on every page: `SiteHeader` (logo, menu), `SiteCtas` (Easy Breathe testing and insurance cards) and `SiteFooter`.

## How it works

Each page contains its full content as plain HTML, so it loads fast and is readable by search engines and without JavaScript.
The same page also includes `<template>` blocks and a matching component script. On load, `js/dc-lite.js` takes over that markup and adds the interactivity: the music player, lyrics toggles, mobile menu, "Mask on / Mask off" photos and form states.

If you change text in a page's template or component script, also update the prerendered copy inside that page's `<div id="root">`, or simply delete the prerendered markup inside `#root` (the page will then render it with JavaScript on load).

## Analytics (self-hosted, on by default with an easy opt-out)

- Connected to Easy Breathe's Cloudflare Worker through `analyticsEndpoint` in `js/ebb-config.js`; empty it to switch analytics off (the separate `ebb-analytics-cloudflare` folder has the Cloudflare Worker and setup steps).
- The dashboard is at `/analytics` (`analytics.html`). It isn't linked anywhere, asks search engines not to list it, and only shows numbers after the analytics service accepts the access code.
- Analytics are on by default with no banner. Anyone can turn them off (or back on) with **Analytics choices** in the footer; the choice is saved in their browser. Browsers that send Global Privacy Control aren't tracked unless the visitor turns analytics on.
- `/privacy` (`privacy.html`) is the privacy and analytics notice, linked from every page's footer. Have compliance review its wording before changing it.
- `/hold` forwards to the Christmas page tagged as hold-music traffic (`?utm_source=hold-music`), so phone-line visits can be counted separately. Redirects from easybreathe.com should add `?utm_source=easybreathe-redirect`. The site removes these tags from the address bar after reading them.

## Seasonal: Christmas

- The page lives at `/christmas` and is announced in the hold music. It is not in the main menu.
- Every other page shows a Christmas banner under the header linking to it. To hide it everywhere after the holiday, open `js/components/SiteSeason.js` and change `show: true` to `show: false`. (The prerendered copy in each page's `#root` is replaced as soon as the page loads; to remove it from the HTML too, delete the `<aside class="ss">` block inside each page's `#root`.)
- The Thanksgiving page is retired: `/thanksgiving` forwards to `/christmas`. Its old photos and songs (`assets/img/thanksgiving/`, `assets/audio/stay-for-the-leftovers.mp3`, `heres-to-the-quiet-ones.mp3`, `keep-the-good.mp3`) are no longer used and can be deleted from the repository.

## Cache versioning

Image, stylesheet and component script references carry `?v=ebb-refresh-20261124` so returning visitors get the refreshed lineup photos. If you replace an image again under the same file name, change that version string everywhere (it is set once as `VER` in the build and appears in the HTML, CSS and JS).

## Settings file

`js/ebb-config.js` holds the three settings that connect outside services: `analyticsEndpoint` (your analytics service), and `klaviyoCompanyId` + `klaviyoListId` (the Easy Breathe newsletter signup on Home and Contact). Leave a value empty to keep that feature off.

## Configuration: links and connections still to finish

| Item | Where | Status |
| --- | --- | --- |
| $150 home sleep test link | `js/components/SiteCtas.js` and `js/components/SiteFooter.js` (`testUrl`) | **Temporary**: points to https://easybreathe.com/. Replace with the $150 offer page before going public. |
| Insurance coverage check link | same files (`insuranceUrl`) | https://insurance.easybreathe.com/ |
| Easy Breathe store link | `js/components/SiteFooter.js` (`storeUrl`), `contact.html` | https://easybreathe.com/ |
| Easy Breathe newsletter signup (Klaviyo) | `js/ebb-config.js` (`klaviyoCompanyId`, `klaviyoListId`) | Not connected yet: the forms on Home and Contact show "Email signup coming soon". Add the Klaviyo public API key and list ID. Signups go straight to Klaviyo's subscription API; no Klaviyo tracking script is loaded. |
| Contact form | `js/components/Contact.js` (`contactEmail`, `contactEndpoint`) | Works now: opens the visitor's email app addressed to easybreatheband@easybreathe.com with their message filled in. Optional: add a form endpoint (POST JSON `{ name, email, topic, message }`) to send without the email app. |
| Home page "Contact the team" | `js/components/Main.js` (`projectContactUrl`) | mailto:easybreatheband@easybreathe.com |
| Social links | `instagramUrl`, `tiktokUrl`, `youtubeUrl` in `Main.js` and `Contact.js`; Instagram also in `SiteFooter.js` template | Instagram set to @easybreatheband. TikTok and YouTube not set (hidden until they have a URL). |
| Privacy and Terms pages | — | Not built: they need owner-approved legal text. |
| Easy Breathe Records site link | — | Shown as plain text until the label site exists. |

## Content notes

- Members: Cal Benton (lead vocals, acoustic guitar), Nina Brooks (bass, backing vocals), Ben Halton (guitar, keys), Tom Kellan (drums).
- Lyrics are the owner-supplied sung text with arrangement cues removed. "CPAP" is always written as CPAP in the lyrics (never a phonetic spelling).
- The fictional-band, AI-music and "not medical advice" disclosures appear on the About page and in the footer of every page. Keep them.
- Fonts: Fraunces, Karla and DM Mono from Google Fonts.
