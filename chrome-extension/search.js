async function init() {
    const overlayContainer = document.querySelector(".overlay-main");
    const overlayKey = "overlayAlreadyShown";

    // Helper function: Extract query parameter ("p" or "q")
    const getQueryData = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("p") || params.get("q") || "";
    };

    // Helper function: Redirect to selected search engine
    const redirectToSearch = async () => {
        const queryData = getQueryData();
        window.location.href = "https://sitenavigator.co/search/results?q=" + encodeURIComponent(queryData);
    };

    // Main logic
    const overlayShown = localStorage.getItem(overlayKey);
    if (overlayShown) {
        overlayContainer.style.display = "none";
        await redirectToSearch();
    } else {
        overlayContainer.style.display = "flex";
        localStorage.setItem(overlayKey, "true");
        setTimeout(async () => {
            overlayContainer.style.display = "none";
            await redirectToSearch();
        }, 5000);
    }
}

init();
