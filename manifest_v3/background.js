// run on page change
chrome.tabs.onUpdated.addListener(function (tabId, changed, tab) {
  if (tab.url.match(/[^/]*:\/\/services\.planningcenteronline\.com\/songs\/[^/]*\/arrangements\/[^/]*/)) {
    chrome.scripting.executeScript({ target: { tabId: tabId }, files: ["song.js"] });
  } else if (tab.url.match(/[^/]*:\/\/services\.planningcenteronline\.com\/plans\/[^/]*/)) {
    chrome.scripting.executeScript({ target: { tabId: tabId }, files: ["plan.js"] });
  } else if (tab.url.match(/[^/]*:\/\/services\.planningcenteronline\.com\/songs\?[^/]*/)) {
    chrome.scripting.executeScript({ target: { tabId: tabId }, files: ["songs.js"] });
  }
});

const requestData = async (script, url, sendResponse) => {
  const planningCenterConn = await chrome.storage.local.get(["clientId", "secret"]);
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Basic ${btoa(planningCenterConn.clientId + ":" + planningCenterConn.secret)}`,
        "content-type": "application/json",
      },
    })

    if (!response.ok) {
      await sendResponse({ error: `Received incorrect response from ${url} api` });
    }
    const data = await response.json();
    await sendResponse({ data });
  } catch (error) {
    await sendResponse({ error: `Failed to fetch ${script} info: ${error}`, });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    if (request.script === "song") {
      await requestData(request.script, `https://api.planningcenteronline.com/services/v2/songs/${request.song}/arrangements/${request.arrangement}`, sendResponse)
    } else if (request.script === "plan") {
      await requestData(request.script, `https://services.planningcenteronline.com/service_types/${request?.ministry_id}/plans/${request?.id}/media_player`, sendResponse)
    } else if (request.script == "songs") {
      await requestData(request.script, `https://api.planningcenteronline.com/services/v2/songs?${request.params}`, sendResponse)
    }
  })();

  return true;
}
);