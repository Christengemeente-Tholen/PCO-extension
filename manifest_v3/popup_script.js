const ccliNumberElm = document.getElementById("ccli_number");
const clientIdElm = document.getElementById("client_id");
const secretElm = document.getElementById("secret");
const messageElm = document.getElementById("message");

chrome.storage.local.get(["clientId", "secret", "showCcliNumber"], function (items) {
    clientIdElm.value = items?.clientId || "";
    secretElm.value = items?.secret || "";
    ccliNumberElm.checked = items?.showCcliNumber || false;
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

async function saveValues() {
    await chrome.storage.local.set({ showCcliNumber: ccliNumberElm.checked, clientId: clientIdElm.value, secret: secretElm.value });
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