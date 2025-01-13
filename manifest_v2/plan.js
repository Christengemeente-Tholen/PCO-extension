test = document.querySelector(".app-header")
const currentPlan = JSON.parse(test.getAttribute("data-react-props"))?.current_plan;
if (currentPlan !== undefined) {

  fetch(`https://services.planningcenteronline.com/service_types/${currentPlan?.ministry_id}/plans/${currentPlan?.id}/media_player`).then(response => response.json()).then(data => {
    const tracks = data?.playlist.map(item => {
      return item?.tracks.map(track => {
        if (track?.src.startsWith("https://www.youtube.com"))
          return URL.parse(track?.src)?.searchParams?.get("v");
      }).find(_ => true)
    }).filter(e => e !== undefined).join(",");

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