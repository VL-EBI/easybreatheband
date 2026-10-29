# EBB — Easy Breathe Band website

Static website for EBB, a fictional band and AI music project from Easy Breathe.
No build step and no dependencies: plain HTML, CSS and JavaScript that runs on GitHub Pages or any static host.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `music.html` | Music: player, setlist and full lyrics |
| `band.html` | Meet the Band |
| `about.html` | About the Project (full story and disclosures) |
| `contact.html` | Contact |
| `404.html` | Page not found |

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
assets/img/        photos, logos (cream + brown), textures, favicon
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

## Configuration: links and connections still to finish

| Item | Where | Status |
| --- | --- | --- |
| $150 home sleep test link | `js/components/SiteCtas.js` and `js/components/SiteFooter.js` (`testUrl`) | **Temporary**: points to https://easybreathe.com/. Replace with the $150 offer page before going public. |
| Insurance coverage check link | same files (`insuranceUrl`) | https://insurance.easybreathe.com/ |
| Easy Breathe store link | `js/components/SiteFooter.js` (`storeUrl`), `contact.html` | https://easybreathe.com/ |
| Audio for Tomorrow Comes in a Box | `js/components/Main.js` (`config().audio`) and `js/components/Music.js` (`audioSources()`) | Not supplied yet. Add the file to `assets/audio/` and its path in both places. |
| Email signup | `js/components/Main.js` (`newsletterEndpoint`) | Not connected: the form shows "Email signup coming soon". Add a signup endpoint (POST JSON `{ email }`) or swap in your email provider's embed. A success message appears only after the endpoint confirms. |
| Contact form | `js/components/Contact.js` (`contactEndpoint`) | Not connected: shows "Contact form coming soon". Sends POST JSON `{ name, email, topic, message }` once set. |
| Home page "Contact the team" | `js/components/Main.js` (`projectContactUrl`) | Not set. Use a `mailto:` address or the contact page URL. |
| Social links | `instagramUrl`, `tiktokUrl`, `youtubeUrl` in `Main.js` and `Contact.js` | Not set. Only links with a URL are shown. |
| Privacy and Terms pages | — | Not built: they need owner-approved legal text. |
| Easy Breathe Records site link | — | Shown as plain text until the label site exists. |

## Content notes

- Members: Cal Benton (lead vocals, acoustic guitar), Nina Brooks (bass, backing vocals), Ben Halton (guitar, keys), Tom Kellan (drums).
- Lyrics are the owner-supplied sung text with arrangement cues removed. "See-pap" is intentional.
- The fictional-band, AI-music and "not medical advice" disclosures appear on the About page and in the footer of every page. Keep them.
- Fonts: Fraunces, Karla and DM Mono from Google Fonts.
