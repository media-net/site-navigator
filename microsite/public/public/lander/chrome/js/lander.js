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

function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "0.0";

    // Chrome/Chromium
    if (userAgent.includes("Chrome/") && !userAgent.includes("Edg/")) {
        browserName = "Chrome";
        const match = userAgent.match(/Chrome\/([\d.]+)/);
        if (match) browserVersion = match[1];
    }
    // Edge
    else if (userAgent.includes("Edg/")) {
        browserName = "Edge";
        const match = userAgent.match(/Edg\/([\d.]+)/);
        if (match) browserVersion = match[1];
    }
    // Firefox
    else if (userAgent.includes("Firefox/")) {
        browserName = "Firefox";
        const match = userAgent.match(/Firefox\/([\d.]+)/);
        if (match) browserVersion = match[1];
    }
    // Safari
    else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) {
        browserName = "Safari";
        const match = userAgent.match(/Version\/([\d.]+)/);
        if (match) browserVersion = match[1];
    }

    return { browserName, browserVersion, userAgent };
}

function updateTrackingCookie2() {
    const params = new URLSearchParams(window.location.search);
    const browserInfo = getBrowserInfo();
  
    const queryParameters = {
        't1': params.get('utm_campaign'),
        't2': params.get('utm_custom1'),
        't3': params.get('utm_term'),
        't4': params.get('utm_content'),
        't5': params.get('utm_custom2'),
        't6': params.get('utm_custom3'),
        't7': params.get('utm_custom4'),
        't8': params.get('utm_source'),
        't9': params.get('utm_custom5')
    };

    const queryString = Object.keys(queryParameters)
        .filter(key => queryParameters[key] !== null)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParameters[key]))
        .join('&');

    const apiUrl = '/api/proxy/getActivationSourceBucket?' + queryString + '&affid=tagI8012002-sitenavigator&domain=sitenavigator.co';

    fetch(apiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {

        let res = data.newData;
        let utmObj = {
            utm_campaign: params.get('utm_campaign'),
            utm_custom1: params.get('utm_custom1'),
            utm_term: params.get('utm_term'),
            utm_source: params.get('utm_source'),
            utm_content: params.get('utm_content'),
            utm_custom2: params.get('utm_custom2'),
            utm_custom3: params.get('utm_custom3'),
            utm_custom4: params.get('utm_custom4'),
            utm_source: params.get('utm_source'),
            utm_custom5: params.get('utm_custom5')
        }
        if (res) {
            let cookieValue = {
                bucketId: res.Distribution_Channel,
                utm: utmObj,
                browserName: browserInfo.browserName,                                    
                browserVersion: browserInfo.browserVersion,                           
                UA: browserInfo.userAgent   
            };

            if (res.Distribution_Date) {
                cookieValue.Distribution_Date = new Date(res.Distribution_Date).toISOString();
            }
            let cookieString = 'bucket=' + btoa(JSON.stringify(cookieValue));

            var expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 365);
            var expirationDateString = expirationDate.toUTCString();

            cookieString += `; expires=${expirationDateString}; path=/; SameSite=Lax; Secure`;

            // Setting the cookie
            document.cookie = cookieString;
        }
    })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function checkIfExtensionInstalled() {
    try {
        console.log("Checking extension status...");
        chrome.runtime.sendMessage(EXTENSION_ID, { type: "PING" }, (response) => {
            if (chrome.runtime.lastError) {
                //console.log("Extension not installed.");
                updateTrackingCookie2();
                return;
            }
            if (response && response.installed) {
                //console.log("Extension detected ✅");
                const continueButtons = document.querySelectorAll('.cta-lander, .cta-button, .atf-cta, .cta-btn, .btf-cta');

                continueButtons.forEach(button => {
                    button.textContent = "Already Installed";
                    button.style.pointerEvents = "none";
                });

            }
        });
    } catch (err) {
        //console.log("Extension not installed or inaccessible.");
        updateTrackingCookie2();
    }
}

// Check extension status every 2 hours and update cookie if not installed
checkIfExtensionInstalled();


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
                    //mixpanelTrack('InstallComplete');
                    setTimeout(() => {
                        window.location.replace('/thankyoupage.html');
                    }, 2000);
                }
            });
        }
    }, 3000);
}


