// run on page change
browser.tabs.onUpdated.addListener(function (tabId, changed, tab) {
    browser.tabs.executeScript(null, { file: "pco_extension.js" });
}, {
    urls: ["*://services.planningcenteronline.com/songs/*/arrangements/*"], properties: ["title"],
  });
