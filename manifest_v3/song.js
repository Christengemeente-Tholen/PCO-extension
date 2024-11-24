moduleBar = document.getElementsByClassName("module-header");
if (moduleBar.length > 0) {
  const buttonList = moduleBar.item(0).querySelector(".flex");
  const regex = /\/songs\/(\d+)\/arrangements\/(\d+)/
  const result = regex.exec(window.location.pathname);
  if (buttonList.querySelector("#pco_extension-button") === null) {
    (async () => {
      const response = await chrome.runtime.sendMessage({ script: "song", song: result[1], arrangement: result[2] });
      if ("error" in response) {
        console.error(response.error);
      }
      const data = response?.data;

      if (buttonList.querySelector("#pco_extension-button") === null) {
        const newButton = document.createElement("a");
        newButton.onclick = () => {
          navigator.clipboard.writeText(data["data"]["attributes"]["lyrics"]);
        }
        newButton.innerText = "Copy Lyrics"
        newButton.href = "#";
        newButton.id = "pco_extension-button"
        newButton.onmouseenter = function () { this.style.backgroundColor = 'hsl(88, 24%, 92%)'; };
        newButton.onmouseleave = function () { this.style.backgroundColor = '' };
        newButton.onmousedown = function () { this.style.backgroundColor = 'hsl(88, 44%, 40%)' };
        newButton.onmouseup = function () { this.style.backgroundColor = 'hsl(88, 24%, 92%)'; };

        if ("error" in response) {
          newButton.style = 'color: rgb(213 0 0); border-radius: 4px; box-shadow: rgb(213 0 0) 0px 0px 0px 1px inset; padding: 2px 8px; font-weight: 700; font-size: 12px; line-height: 20px;'
          newButton.title = "Extension isn't setup correctly! please click on the icon of the extension to configure it."
        } else {
          newButton.style = 'border-radius: 4px; box-shadow: inset 0px 0px 0px 1px hsl(88, 44%, 40%); padding: 2px 8px; font-weight: 700; font-size: 12px; line-height: 20px;'
        }

        buttonList.appendChild(newButton);
      }
    })();
  }
}