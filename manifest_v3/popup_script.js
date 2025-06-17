/** @type {HTMLInputElement} */
const ccliNumberElm = document.getElementById("ccli_number");
/** @type {HTMLInputElement} */
const youtubePlanSongsElm = document.getElementById("youtube_plan_songs");
/** @type {HTMLInputElement} */
const clientIdElm = document.getElementById("client_id");
/** @type {HTMLInputElement} */
const secretElm = document.getElementById("secret");
/** @type {HTMLInputElement} */
const messageElm = document.getElementById("message");
/** @type {HTMLInputElement} */
const autoremoveHeadingElm = document.getElementById("autoremove_heading");
/** @type {HTMLSelectElement} */
const autoremoveHeadingItemsElm = document.getElementById("autoremove_heading_items");
/** @type {HTMLInputElement} */
const addHeadingItemTextElm = document.getElementById("add_heading_item_text");

/**
 * Add a new option to the autoremove_heading_items select object
 * @param {string} text 
 */
function addNewOption(text) {
  const opt = document.createElement('option');
  opt.value = text;
  opt.innerText = text;
  autoremoveHeadingItemsElm.appendChild(opt);
}

chrome.storage.local.get(["clientId", "secret", "showCcliNumber", "autoremoveHeading", "autoremoveHeadingItems", "showYoutubeInPlans"], function (items) {
  clientIdElm.value = items?.clientId || "";
  secretElm.value = items?.secret || "";
  youtubePlanSongsElm.checked = items?.showYoutubeInPlans || false;
  ccliNumberElm.checked = items?.showCcliNumber || false;
  autoremoveHeadingElm.checked = items?.autoremoveHeading || false;
  items?.autoremoveHeadingItems.forEach(element => {
    addNewOption(element);
  });
});

async function checkValues() {
  const response = await fetch(`https://api.planningcenteronline.com/services/v2/songs`, {
    headers: {
      "Authorization": `Basic ${window.btoa(clientIdElm.value + ":" + secretElm.value)}`,
      "content-type": "application/json",
    },
  });
  const result = await response.json();
  if (result?.links.self === "https://api.planningcenteronline.com/services/v2/songs") {
    messageElm.className = "text-success"
    messageElm.innerText = "Test successful!";
  } else {

    messageElm.className = "text-danger"
    messageElm.innerText = "Api didn't return the correct response!";
  }
}

document.getElementById("remove_heading_item").addEventListener("click", () => {
  Array.from(autoremoveHeadingItemsElm.selectedOptions).forEach((option) => {
    option.remove();
  })
})

document.getElementById("add_heading_item").addEventListener("click", () => {
  addNewOption(addHeadingItemTextElm.value);
})

async function saveValues() {
  const newRemoveHeadingItems = Array.from(autoremoveHeadingItemsElm.options).map(e => e.value);

  await chrome.storage.local.set({ showCcliNumber: ccliNumberElm.checked, clientId: clientIdElm.value, secret: secretElm.value, autoremoveHeadingItems: newRemoveHeadingItems, autoremoveHeading: autoremoveHeadingElm.checked, showYoutubeInPlans: youtubePlanSongsElm.checked });
  messageElm.className = "text-success"
  messageElm.innerText = "Changes saved successfully."
}

document.getElementById("planningCenterConn").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    if (e?.submitter?.name == "test") {
      await checkValues();
    } else {
      await saveValues();
    }
  } catch (e) {
    messageElm.className = "text-danger"
    messageElm.innerText = "Setup failed with error: " + e;
  }
});