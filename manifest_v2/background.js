// run on page change
browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  browser.tabs.executeScript(null, { file: "song.js" });
}, {
  urls: ["*://services.planningcenteronline.com/songs/*/arrangements/*"], properties: ["title"],
});

browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  browser.tabs.executeScript(null, { file: "global.js" });
  browser.tabs.executeScript(null, { file: "plan.js" });
}, {
  urls: ["*://services.planningcenteronline.com/plans/*"], properties: ["title"],
});

browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  browser.tabs.executeScript(null, { file: "global.js" });
  browser.tabs.executeScript(null, { file: "songs.js" });
}, {
  urls: ["*://services.planningcenteronline.com/songs?*"], properties: ["url"],
});

// run on install or update
browser.runtime.onInstalled.addListener(async function (details) {
  const current = await browser.storage.local.get(["autoremoveHeadingItems"]);
  if (current?.autoremoveHeadingItems == undefined) {
    const initialAutoremoveHeadingItems = [
      "vers",
      "verse",
      "couplet",
      "bridge",
      "chorus",
      "pre-chorus",
      "intermezzo",
      "intro",
      "tag",
    ];
    await browser.storage.local.set({ autoremoveHeadingItems: initialAutoremoveHeadingItems });
  }
})