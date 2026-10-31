# Open in Spotify App

A Firefox extension that opens links to Spotify tracks, albums, playlists, artists, podcasts and profiles in the desktop app instead of the browser. It works on macOS and Windows, because both versions of the app handle the `spotify:` scheme.

Firefox only: it won't work in Chrome, which no longer supports Manifest V2 and blocking `webRequest`.

## How it works

- Only full-tab navigation to `open.spotify.com` or `play.spotify.com` is intercepted. Players embedded in websites are left alone.
- The address is converted to `spotify:type:id` and handed to the app.
- A tab opened just for this link closes as soon as Firefox loses focus (Spotify came to the front), or after 15 seconds. It can't close immediately, because Firefox's permission prompt would disappear along with the tab.
- If a link was clicked without opening a new tab, you simply stay on the current page.
- Link from another app: the window minimizes when Spotify comes to the front. Other tabs stay open.
- If the closed tab was the only one in its window, the window closes with it.
- Clicks inside Firefox don't minimize the browser.
- The home page, search and other non-content pages stay in the browser.
- The toolbar button turns interception on and off. A gray icon means it's off.

## Temporary install for testing

1. Copy this folder to the computer with Firefox.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and select `manifest.json`.

The extension disappears when Firefox restarts.

## What to check

| Action | Expected result |
|--------|-----------------|
| Paste `https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC` into the address bar of a new tab | Permission prompt the first time only (choose "always"), Spotify opens, the tab closes; the window may minimize, because the address bar can look like an external source |
| Click a Spotify link on a website without `target=_blank` | Spotify opens, the website stays in place, the window doesn't minimize |
| Click a link that opens in a new tab | Spotify opens, the new tab closes, the window doesn't minimize |
| With Firefox open, click a link in a messenger or email | Spotify opens, the new tab closes, the window minimizes |
| Open `https://open.spotify.com/` | Stays in the browser |
| Click the toolbar button and repeat the first row | The track opens in the browser, the icon is gray |

If something is wrong, check the console: `about:debugging` → **Inspect** next to the extension.

## Permanent install

Regular Firefox only keeps signed extensions permanently. Signing is free and doesn't publish the extension to the catalog.

1. Sign in at [addons.mozilla.org](https://addons.mozilla.org/developers/) with a Mozilla account.
2. Click **Submit a New Add-on** and choose **On your own**.
3. Upload `dist/open-in-spotify-app.zip`.
4. After the automatic review, download the signed `.xpi` and drag it into a Firefox window.

For private windows, allow the extension separately: `about:addons` → the extension → **Run in Private Windows**.

## Limitations

- The browser can't tell whether the app is installed. If you don't have Spotify, click the toolbar button to turn interception off.
- Navigation inside the web player isn't intercepted, because the page doesn't reload.

## Development

On macOS, `make test` runs the address checks and `make zip` builds the archive in `dist/`. On Windows, zip `manifest.json`, `background.js`, `spotify-link.js` and the `icons` folder so that `manifest.json` sits at the root of the archive.
