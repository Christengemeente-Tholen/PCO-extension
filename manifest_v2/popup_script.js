const ccliNumberElm = document.getElementById("ccli_number");
const messageElm = document.getElementById("message");

browser.storage.local.get(["showCcliNumber"], function (items) {
    ccliNumberElm.checked = items?.showCcliNumber || false;
});

async function saveValues() {
    await browser.storage.local.set({ showCcliNumber: ccliNumberElm.checked });
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