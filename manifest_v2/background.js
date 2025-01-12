// run on page change
browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  browser.tabs.executeScript(null, { file: "song.js" });
}, {
  urls: ["*://services.planningcenteronline.com/songs/*/arrangements/*"], properties: ["title"],
});

browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  browser.tabs.executeScript(null, { file: "plan.js" });
}, {
  urls: ["*://services.planningcenteronline.com/plans/*"], properties: ["title"],
});

browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  browser.tabs.executeScript(null, { file: "songs.js" });
}, {
  urls: ["*://services.planningcenteronline.com/songs?*"], properties: ["url"],
});
