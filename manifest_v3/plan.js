function elementReady(selector) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
    }

    new MutationObserver((mutationRecords, observer) => {
      Array.from(document.querySelectorAll(selector)).forEach(element => {
        resolve(element);
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}


currentPlan = JSON.parse(document.querySelector(".app-header").getAttribute("data-react-props"))?.current_plan;
if (currentPlan !== undefined && currentPlan?.ministry_id !== undefined) {
  (async () => {
    const response = await fetch(`https://services.planningcenteronline.com/service_types/${currentPlan?.ministry_id}/plans/${currentPlan?.id}/media_player`);
    const data = await response.json();
    const tracks = data?.playlist.map(item => {
      return item?.tracks.map(track => {
        if (track?.src.startsWith("https://www.youtube.com"))
          return URL.parse(track?.src)?.searchParams?.get("v");
      }).find(_ => true)
    }).filter(e => e !== undefined).join(",");

    const element = await elementReady('[aria-label="close playlist"]')
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
  })();
}