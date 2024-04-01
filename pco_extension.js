const moduleBar = document.getElementsByClassName("module-header");
if (moduleBar.length > 0) {
    const buttonList = moduleBar.item(0).querySelector(".flex");
    const regex = /\/songs\/(\d+)\/arrangements\/(\d+)/
    const result = regex.exec(window.location.pathname);

    fetch(`https://api.planningcenteronline.com/services/v2/songs/${result[1]}/arrangements/${result[2]}`).then(response => {
        if (!response.ok) {
            console.error(`Received incorrect response from https://api.planningcenteronline.com/services/v2/songs/${result[1]}/arrangements/${result[2]} api`)
        }
        return response.json();
    })
        .then(data => {
            const newButton = document.createElement("a");
            newButton.onclick = () => {
                navigator.clipboard.writeText(data["data"]["attributes"]["lyrics"]);
            }
            newButton.innerText = "Copy Lyrics"
            newButton.href = "#";

            buttonList.appendChild(newButton);
        })
        .catch(error => {
            console.error('Failed to fetch song info:', error);
        });
}