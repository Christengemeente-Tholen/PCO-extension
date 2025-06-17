/** @type {HTMLTableHeaderCellElement} */
test = document.querySelector(".app-header")

const currentPlan = JSON.parse(test.getAttribute("data-react-props"))?.current_plan;
if (currentPlan !== undefined) {

  fetch(`https://services.planningcenteronline.com/service_types/${currentPlan?.ministry_id}/plans/${currentPlan?.id}/media_player`).then(response => response.json()).then(data => {
    const youtube_songs = dataToSongList(data);
    browser.storage.local.get(["showYoutubeInPlans"]).then(planningCenterSettings => {
      if (planningCenterSettings.showYoutubeInPlans) {
        /** @type {HTMLDivElement} */
        songs_table = document.querySelector('[data-react-class="Components.Plans.PlanContainer"]');
        /** @type {HTMLDivElement} */
        const element = songs_table.querySelectorAll('[role="rowgroup"]')[1];

        updateYoutubeSongTable(songs_table, youtube_songs)

        var observer = new MutationObserver(function () {
          fetch(`https://services.planningcenteronline.com/service_types/${currentPlan?.ministry_id}/plans/${currentPlan?.id}/media_player`).then(response => response.json()).then(data => {
            const cur = dataToSongList(data);
            // on table update
            updateYoutubeSongTable(songs_table, cur)
          });
        });

        observer.observe(element, {
          subtree: true,
          childList: true,
        });
      }
    });

    const tracks = youtube_songs.map(track => URL.parse(track.src)?.searchParams?.get("v")).join(",");

    elementReady('[aria-label="close playlist"]').then(element => {
      if (document.querySelector("#pco_extension-button") === null) {
        const newButton = document.createElement("a");
        newButton.onclick = () => {
          navigator.clipboard.writeText(`https://www.youtube.com/watch_videos?video_ids=${tracks}`);
        }
        newButton.innerText = "Copy as playlist"
        newButton.href = "#";
        newButton.id = "pco_extension-button"
        newButton.style = "margin-left: auto;"
        element.parentElement.insertBefore(newButton, element);
      }
    });
  })
}

function updateYoutubeSongTable(songs_table, youtube_songs) {
  const rowgroup = songs_table.querySelectorAll('[role="rowgroup"]');
  if (songs_table.querySelector("#pco_extension-playlist_heading") === null) {
    const heading = document.createElement("div");
    heading.role = "columnheader";
    heading.tabIndex = "0";
    heading.id = "pco_extension-playlist_heading";
    heading.classList = "xi xj xf xk xl xm xn xo xp xq xr xs xh xt xu";
    const innerDiv = document.createElement("span");
    innerDiv.classList = "tapestry-react-services-1k7pct3"
    innerDiv.innerText = "YouTube link";
    heading.appendChild(innerDiv)
    const row = rowgroup[0].querySelector('[role="row"]')
    row.insertBefore(heading, row.lastChild)
  }

  const song_dict = Object.fromEntries(youtube_songs.map(d => [d.id, d.src]))
  if (songs_table.querySelector("#pco_extension-playlist_number") === null) {
    Array.from(rowgroup[1].children).forEach(element => {
      const song_id = element?.dataset["rbdDraggableId"]
      const song_link = song_dict[song_id];

      if (song_link !== undefined) {
        let playlist_link = document.createElement("div");

        playlist_link = document.createElement("a");
        playlist_link.href = song_link;
        playlist_link.target = "_blank";
        playlist_link.innerText = "Link";
        playlist_link.id = "pco_extension-playlist_number";
        playlist_link.role = "cell";
        playlist_link.classList = "xi xf x1c x1d xl xm xn xo xp xx xr xy xh";
        element.insertBefore(playlist_link, element.lastChild);
      }

    })
  }
}

function dataToSongList(data) {
  return data?.playlist.flatMap(d => {
    const youtube_items = d.tracks?.filter(s => s.src.startsWith("https://www.youtube.com"))
    return youtube_items[0] !== undefined ? { id: youtube_items[0]?.group_id, src: youtube_items[0]?.src } : undefined
  }).filter(d => d !== undefined);
}