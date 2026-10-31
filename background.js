// Long enough to answer Firefox's first-time "open spotify link?" prompt, which dies with the tab.
const CLOSE_FALLBACK_MS = 15000;
const BLANK_TAB_URLS = new Set(["about:blank", "about:newtab", "about:home", "about:privatebrowsing"]);

const pendingHandoffs = new Map();
let enabled = true;

function renderToggle() {
  browser.browserAction.setIcon({ path: enabled ? "icons/on.svg" : "icons/off.svg" });
  browser.browserAction.setTitle({ title: enabled ? "Spotify links: app" : "Spotify links: browser" });
}

function forgetHandoff(tabId) {
  const handoff = pendingHandoffs.get(tabId);
  if (handoff) {
    clearTimeout(handoff.timer);
    pendingHandoffs.delete(tabId);
  }
  return handoff;
}

function closeTab(tabId) {
  browser.tabs.remove(tabId).catch(() => {});
}

function finishHandoff(tabId) {
  const handoff = forgetHandoff(tabId);

  if (handoff.fromOtherApp) {
    browser.windows.update(handoff.windowId, { state: "minimized" }).catch(() => {});
  }
  if (handoff.isNewTab) {
    closeTab(tabId);
  }
}

async function handOff(details, spotifyUri) {
  const tabId = details.tabId;
  const tab = await browser.tabs.get(tabId);
  const isNewTab = BLANK_TAB_URLS.has(tab.url) || tab.url === details.url;
  // A click inside Firefox has an originating page; a link from another app does not.
  const fromOtherApp = !details.originUrl;

  await browser.tabs.update(tabId, { url: spotifyUri });

  if (isNewTab || fromOtherApp) {
    const timer = setTimeout(() => {
      // Spotify never took focus, so the user may still be in Firefox: only tidy up the tab.
      forgetHandoff(tabId);
      if (isNewTab) {
        closeTab(tabId);
      }
    }, CLOSE_FALLBACK_MS);
    pendingHandoffs.set(tabId, { timer, windowId: tab.windowId, isNewTab, fromOtherApp });
  }
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const spotifyUri = enabled && details.tabId >= 0 ? toSpotifyUri(details.url) : null;
    if (!spotifyUri) {
      return {};
    }

    handOff(details, spotifyUri).catch(console.error);
    return { cancel: true };
  },
  { urls: ["*://open.spotify.com/*", "*://play.spotify.com/*"], types: ["main_frame"] },
  ["blocking"]
);

// Firefox losing focus means Spotify came to the front, so the handoff is done.
browser.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE) {
    [...pendingHandoffs.keys()].forEach(finishHandoff);
  }
});

browser.tabs.onRemoved.addListener(forgetHandoff);

browser.browserAction.onClicked.addListener(() => {
  enabled = !enabled;
  browser.storage.local.set({ enabled });
  renderToggle();
});

browser.storage.local.get({ enabled: true }).then((stored) => {
  enabled = stored.enabled;
  renderToggle();
});
