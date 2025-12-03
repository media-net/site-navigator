const EXTENSION_STORE_URL = 'https://chromewebstore.google.com/detail/site-navigator/fognonnbfihcdmnabfkgkpojndahbfml?hl=en&authuser=1';
//const LOCAL_EXTENSION_ID = 'jcfogflciihpipeckbmoahpbildclfna'; // Local unpacked extension ID
const CHECK_INTERVAL = 1000; // Check every second
const MAX_CHECK_ATTEMPTS = 300; // Stop checking after 5 minutes (300 seconds)

let installWindow = null;
let checkAttempts = 0;
let checkInterval = null;
let windowCheckInterval = null;

const EXTENSION_ID = "fognonnbfihcdmnabfkgkpojndahbfml"; //  live/local extension ID
setTimeout(function () {
    // Hide checking compatibility message
    document.querySelector(".checking-msg").style.display = "none";
    
    // Show compatibility group after compatibility check with fade-in effect
    var compatGroup = document.querySelector(".compatibility-group");
    
    if (compatGroup) {
        compatGroup.style.display = "block";
        compatGroup.classList.add("fadeInSlow");
    }
}, 2000)

function checkIfExtensionInstalled() {
    try {
        chrome.runtime.sendMessage(EXTENSION_ID, { type: "PING" }, (response) => {
            if (chrome.runtime.lastError) {
                //console.log("Extension not installed.");
                //console.log("Chrome error: ", chrome.runtime.lastError);
                const continueButtons = document.querySelectorAll('.cta-lander, .cta-button, .atf-cta');

                continueButtons.forEach(button => {
                    button.textContent = "Continue";
                    button.style.pointerEvents = "auto";
                });

                const stepCtaButton = document.querySelectorAll('.step-cta');

                stepCtaButton.forEach(button => {
                    button.style.pointerEvents = "auto";
                });

                return;
            }
            if (response && response.installed) {
                //console.log("Extension detected ✅");
                const continueButtons = document.querySelectorAll('.cta-lander, .cta-button, .atf-cta');

                continueButtons.forEach(button => {
                    button.textContent = "Already Installed";
                    button.style.pointerEvents = "none";
                });

                const stepCtaButton = document.querySelectorAll('.step-cta');

                stepCtaButton.forEach(button => {
                    button.style.pointerEvents = "none";
                });

            }
        });
    } catch (err) {
        //console.log("Extension not installed or inaccessible.");
    }
}

// Optionally: run every few seconds to detect installation live
setInterval(checkIfExtensionInstalled, 2000);


const continueButtons = document.querySelectorAll('.cta-lander, .cta-button, .atf-cta, .step-cta');

console.log(`Found ${continueButtons.length} continue button(s)`);

continueButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        handleContinueClick(event);
    });
});

function handleContinueClick(event) {
    event.preventDefault();

    mixpanelTrack('CtaClick');
    installWindow = window.open(
        EXTENSION_STORE_URL,
        "VisualSearch",
        `left=0,top=0,width=${screen.availWidth},height=${screen.availHeight},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );

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


