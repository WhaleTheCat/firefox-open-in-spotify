const SPOTIFY_ORIGIN = String.raw`^https?://(?:open|play)\.spotify\.com(?:/intl-[a-z-]+)?`;

const CONTENT_LINK = new RegExp(
  SPOTIFY_ORIGIN + String.raw`/(track|album|playlist|artist|show|episode)/([A-Za-z0-9]+)(?:[/?#]|$)`
);
const USER_LINK = new RegExp(
  SPOTIFY_ORIGIN + String.raw`/user/([^/?#:]+)(?:/playlist/([A-Za-z0-9]+))?/?(?:[?#]|$)`
);

// Returns null for anything that is not content (home, search, embeds), so it stays in the browser.
function toSpotifyUri(webUrl) {
  const content = CONTENT_LINK.exec(webUrl);
  if (content) {
    return `spotify:${content[1]}:${content[2]}`;
  }

  const user = USER_LINK.exec(webUrl);
  if (user) {
    return user[2] ? `spotify:user:${user[1]}:playlist:${user[2]}` : `spotify:user:${user[1]}`;
  }

  return null;
}
