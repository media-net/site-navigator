const EXTENSION_ID = "fognonnbfihcdmnabfkgkpojndahbfml"; //  live/local extension ID

document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
        const parent = header.parentElement;
        const content = header.nextElementSibling;
        
        // Toggle the current accordion
        parent.classList.toggle("active");
        
        if (parent.classList.contains("active")) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = null;
        }
        
        // Close any other open accordion
        document.querySelectorAll(".accordion-item.active").forEach((item) => {
            if (item !== parent) {
                item.classList.remove("active");
                item.querySelector(".accordion-content").style.maxHeight = null;
            }
        });
    });
});


const continueButtons = document.querySelectorAll('.cta-lander, .cta-button, .atf-cta, .step-cta, .btf-cta');

console.log(`Found ${continueButtons.length} continue button(s)`);

continueButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        handleContinueClick(event);
    });
});

function handleContinueClick(event) {
    event.preventDefault();

    mixpanelTrack('CtaClick');
    
    // Open Chrome Web Store in a new tab
    const chromeStoreUrl = 'https://chromewebstore.google.com/detail/site-navigator/fognonnbfihcdmnabfkgkpojndahbfml?hl=en&authuser=1';
    window.open(chromeStoreUrl, '_blank');
    

    // Start polling every 2 seconds
    const pollInterval = setInterval(() => {
        if (chrome.runtime) {
            chrome.runtime.sendMessage(EXTENSION_ID, { type: "CLICKPING" }, (response) => {
                if (chrome.runtime.lastError) {
                    //console.log("Extension not installed.");
                    return;
                }
                if (response && response.installed) {
                    //console.log("Extension detected after clickk✅");
                    clearInterval(pollInterval); // Stop polling
                    mixpanelTrack('InstallComplete');
                    setTimeout(() => {
                        window.location.replace('/thankyoupage.html');
                    }, 2000);
                }
            });
        }
    }, 3000);
}


