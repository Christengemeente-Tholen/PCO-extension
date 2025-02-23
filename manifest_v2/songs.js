browser.storage.local.get(["showCcliNumber"]).then(planningCenterSettings => {
  if (planningCenterSettings.showCcliNumber) {
    songs_table = document.querySelector('[data-react-class="Components.Songs.Index.Default"]');
    const element = songs_table.querySelector('[role="grid"]');
    // on page update
    updateCcliInfo();

    var observer = new MutationObserver(function () {
      if (window.getComputedStyle(element).display == "block") {
        // on table update
        updateCcliInfo();
      }
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['style']
    });
  }
});

/**
 * Update the CCLI column
 */
function updateCcliInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("offset", (urlParams.get("page") - 1) * urlParams.get("per_page"));
  fetch(`https://api.planningcenteronline.com/services/v2/songs/?${urlParams.toString()}`).then(response => {
    if (!response.ok) {
      console.error(`Received incorrect response from https://api.planningcenteronline.com/services/v2/songs/?${urlParams.toString()} api`)
    }
    return response.json();
  }).then(data => {
    const song_list = data.data;
    songs_table = document.querySelector('[data-react-class="Components.Songs.Index.Default"]');
    // if (songs_table !== undefined) {
    const ccli_songs = {};
    // const song_list = JSON.parse(songs_table?.attributes?.getNamedItem("data-react-props")?.value)?.songs;
    song_list.forEach(element => {
      ccli_songs[element.id] = element.attributes.ccli_number ?? "N/A";
    });
    const rowgroup = songs_table.querySelectorAll('[role="rowgroup"]');


    if (songs_table.querySelector("#pco_extension-ccli_heading") === null) {
      const heading = document.createElement("div");
      heading.role = "columnheader";
      heading.tabIndex = "0";
      heading.id = "pco_extension-ccli_heading";
      heading.classList = "xj xv xg xl xm xn xo xp xq xr xs xt xi";
      heading.innerText = "CCLI number";
      rowgroup[0].querySelector('[role="row"]').appendChild(heading)
    }
    if (songs_table.querySelector("#pco_extension-ccli_number") === null) {
      Array.from(rowgroup[1].children).forEach(element => {
        const song_url = element.querySelector("a")?.pathname;
        const result = song_url?.match(/^\/songs\/(.*)\/arrangements\/.*$/);
        if (result?.length > 0) {
          const ccli_number = ccli_songs[result[1]];
          if (ccli_number !== undefined) {
            let ccli_link = document.createElement("div");
            if (ccli_number !== "N/A") {
              ccli_link = document.createElement("a");
              ccli_link.href = `https://songselect.ccli.com/songs/${ccli_number}`;
              ccli_link.target = "_blank";
            }
            ccli_link.innerText = ccli_number;
            ccli_link.id = "pco_extension-ccli_number";
            ccli_link.role = "cell";
            ccli_link.classList = "xj xg x10 x11 xm xn xo xp xq xr xs xt xi";
            element.appendChild(ccli_link);
          }
        }
      })
    }
  })
}