// Run with: make test
const CASES = [
  ["https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC", "spotify:track:4uLU6hMCjMI75M1A2tKUQC"],
  ["https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=abc&context=x", "spotify:track:4uLU6hMCjMI75M1A2tKUQC"],
  ["https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC/", "spotify:track:4uLU6hMCjMI75M1A2tKUQC"],
  ["https://open.spotify.com/intl-uk/album/1ATL5GLyefJaxhQzSPVrLX?si=1", "spotify:album:1ATL5GLyefJaxhQzSPVrLX"],
  ["http://play.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"],
  ["https://open.spotify.com/artist/0OdUWJ0sBjDrqHygGUXeCF/discography/all", "spotify:artist:0OdUWJ0sBjDrqHygGUXeCF"],
  ["https://open.spotify.com/show/38bS44xjbVVZ3No3ByF1dJ", "spotify:show:38bS44xjbVVZ3No3ByF1dJ"],
  ["https://open.spotify.com/episode/512ojhOuo1ktJprKbVcKyQ#t=10", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"],
  ["https://open.spotify.com/user/spotify", "spotify:user:spotify"],
  ["https://open.spotify.com/user/spotify/playlist/37i9dQZF1DXcBWIGoYBM5M", "spotify:user:spotify:playlist:37i9dQZF1DXcBWIGoYBM5M"],

  ["https://open.spotify.com/", null],
  ["https://open.spotify.com/search/queen", null],
  ["https://open.spotify.com/collection/tracks", null],
  ["https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC", null],
  ["https://open.spotify.com/track/", null],
  ["https://open.spotify.com/user/a:b", null],
  ["https://www.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC", null],
  ["https://example.com/?u=https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC", null],
];

let failures = 0;
for (const [url, expected] of CASES) {
  const actual = toSpotifyUri(url);
  if (actual !== expected) {
    failures++;
    print(`FAIL ${url}\n  expected ${expected}\n  actual   ${actual}`);
  }
}
print(`${CASES.length - failures}/${CASES.length} passed`);
if (failures) {
  quit(1);
}
