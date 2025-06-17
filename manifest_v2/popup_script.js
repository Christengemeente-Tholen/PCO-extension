/** @type {HTMLInputElement} */
const ccliNumberElm = document.getElementById("ccli_number");
/** @type {HTMLInputElement} */
const youtubePlanSongsElm = document.getElementById("youtube_plan_songs");
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

browser.storage.local.get(["showCcliNumber", "autoremoveHeading", "autoremoveHeadingItems", "showYoutubeInPlans"], function (items) {
  ccliNumberElm.checked = items?.showCcliNumber || false;
  youtubePlanSongsElm.checked = items?.showYoutubeInPlans || false;
  autoremoveHeadingElm.checked = items?.autoremoveHeading || false;
  items?.autoremoveHeadingItems.forEach(element => {
    addNewOption(element);
  });
});

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

  await browser.storage.local.set({ showCcliNumber: ccliNumberElm.checked, autoremoveHeadingItems: newRemoveHeadingItems, autoremoveHeading: autoremoveHeadingElm.checked, showYoutubeInPlans: youtubePlanSongsElm.checked });
  messageElm.className = "text-success"
  messageElm.innerText = "Changes saved successfully."
}

document.getElementById("planningCenterSettings").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await saveValues();
  } catch (e) {
    messageElm.className = "text-danger"
    messageElm.innerText = "Setup failed with error: " + e;
  }
});