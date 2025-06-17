/**
 * Removed the html tags from the passed string
 * @param {string} html 
 * @returns string
 */
function stripHtml(html) {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

function buttonStyle(newButton) {
  newButton.onmouseenter = function () { this.style.backgroundColor = 'hsl(88, 24%, 92%)'; };
  newButton.onmouseleave = function () { this.style.backgroundColor = '' };
  newButton.onmousedown = function () { this.style.backgroundColor = 'hsl(88, 44%, 40%)' };
  newButton.onmouseup = function () { this.style.backgroundColor = 'hsl(88, 24%, 92%)'; };
  newButton.style = 'border-radius: 4px; box-shadow: inset 0px 0px 0px 1px hsl(88, 44%, 40%); padding: 2px 8px; font-weight: 700; font-size: 12px; line-height: 20px;'
}

moduleBar = document.getElementsByClassName("module-header");
if (moduleBar.length > 0) {
  /** @type {HTMLDivElement} */
  const buttonList = moduleBar.item(0).querySelector(".flex");
  const regex = /\/songs\/(\d+)\/arrangements\/(\d+)/
  const result = regex.exec(window.location.pathname);
  (async () => {
    if (buttonList.querySelector("#pco_extension-button") === null) {
      try {
        const response = await fetch(`https://api.planningcenteronline.com/services/v2/songs/${result[1]}/arrangements/${result[2]}`)
        if (!response.ok) {
          console.error(`Received incorrect response from https://api.planningcenteronline.com/services/v2/songs/${result[1]}/arrangements/${result[2]} api`)
        }
        const data = await response.json();
        if (buttonList.querySelector("#pco_extension-button") === null) {
          const newButton = document.createElement("a");
          newButton.onclick = async () => {
            /** @type {string} */
            let lyrics = data?.data?.attributes?.lyrics;
            const planningCenterSettings = await browser.storage.local.get(["autoremoveHeading", "autoremoveHeadingItems"]);
            if (planningCenterSettings.autoremoveHeading) {
              /** @type {string[]} */
              let autoremoveHeadingItems = planningCenterSettings.autoremoveHeadingItems || [];
              // remove html tags
              lyrics = stripHtml(lyrics);
              // strip text from lyrics based on set value
              autoremoveHeadingItems.forEach(element => {
                lyrics = lyrics.replace(RegExp("^(?:" + element + ")(| \\d+| \\d+:)(| \\(2x\\)| 2x)$", "gmi"), '')
              })
              // remove extra whitespace
              lyrics = lyrics.replace(/\n\n\n/gm, "\n\n");
              // remove all unneeded whitespace before and behind the lyrics
              lyrics = lyrics.replace(/^\n+/, "");
              lyrics = lyrics.replace(/\n+$/, "");
              navigator.clipboard.writeText(lyrics);
            } else {
              navigator.clipboard.writeText(lyrics);
            }
          }
          newButton.innerText = "Copy Lyrics"
          newButton.href = "#";
          newButton.id = "pco_extension-button"
          buttonStyle(newButton);
          buttonList.appendChild(newButton);
        }
      } catch (error) {
        console.error('Failed to fetch song info:', error);
      }
    }
    if (buttonList.querySelector("#pco_extension-ccli_button") === null) {
      try {
        const response = await fetch(`https://api.planningcenteronline.com/services/v2/songs/${result[1]}`)
        const data = await response.json();
        if (buttonList.querySelector("#pco_extension-ccli_button") === null) {
          const newButton = document.createElement("a");
          newButton.innerText = "Goto CCLI"
          newButton.href = `https://songselect.ccli.com/songs/${data?.data?.attributes?.ccli_number}`;
          newButton.target = "_blank"
          newButton.id = "pco_extension-ccli_button"
          buttonStyle(newButton);
          buttonList.appendChild(newButton);
        }
      } catch (error) {
        console.error('Failed to fetch ccli info:', error);
      }
    }
  })();
}
undefined;