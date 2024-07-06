moduleBar = document.getElementsByClassName("module-header");
if (moduleBar.length > 0) {
    const buttonList = moduleBar.item(0).querySelector(".flex");
    const regex = /\/songs\/(\d+)\/arrangements\/(\d+)/
    const result = regex.exec(window.location.pathname);
    if (buttonList.querySelector("#pco_extension-button") === null) {
        fetch(`https://api.planningcenteronline.com/services/v2/songs/${result[1]}/arrangements/${result[2]}`).then(response => {
            if (!response.ok) {
                console.error(`Received incorrect response from https://api.planningcenteronline.com/services/v2/songs/${result[1]}/arrangements/${result[2]} api`)
            }
            return response.json();
        })
            .then(data => {

                if (buttonList.querySelector("#pco_extension-button") === null) {
                    const newButton = document.createElement("a");
                    newButton.onclick = () => {
                        navigator.clipboard.writeText(data["data"]["attributes"]["lyrics"]);
                    }
                    newButton.innerText = "Copy Lyrics"
                    newButton.href = "#";
                    newButton.id = "pco_extension-button"
                    newButton.onmouseenter = function(){ this.style.backgroundColor = 'hsl(88, 24%, 92%)'; };
                    newButton.onmouseleave = function(){ this.style.backgroundColor = '' };
                    newButton.onmousedown = function(){ this.style.backgroundColor = 'hsl(88, 44%, 40%)' };
                    newButton.onmouseup = function(){ this.style.backgroundColor = 'hsl(88, 24%, 92%)'; };
                    newButton.style = 'border-radius: 4px; box-shadow: inset 0px 0px 0px 1px hsl(88, 44%, 40%); padding: 2px 8px; font-weight: 700; font-size: 12px; line-height: 20px;' 
        
                    buttonList.appendChild(newButton);
                }
            })
            .catch(error => {
                console.error('Failed to fetch song info:', error);
            });
    }
}
undefined;