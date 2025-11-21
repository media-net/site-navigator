importScripts("../StorageHandler.js", "../constants.js")


chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
        "priority": 10,
        "id": 1,
        "condition": {
            "resourceTypes": ["main_frame"],
            "urlFilter": "sitenavigator.co/search/rd/results"
        },
        "action": {
            "redirect": {
                "transform": {
                    "scheme": "chrome-extension",
                    "host": chrome.runtime.id,
                    "path": "redirectSearch.html"
                }
            },
            "type": "redirect"
        }
    }],
    removeRuleIds: [1]
});


chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        setUninstallUrl();
    } else if (details.reason === 'update') {
        setUninstallUrl();
    }
});

async function closePopupWindows() {
    const tabs = await chrome.tabs.query({ windowType: "popup" });
    if (Array.isArray(tabs)) {
        tabs.forEach(({ id }) => chrome.tabs.remove(id));
    }
}

/**
Handle external messages (from website)
*/
chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
    if (message.type === "PING") {
        sendResponse({ installed: true, version: chrome.runtime.getManifest().version });
    } else if (message.type === "CLICKPING") {
        sendResponse({ installed: true, version: chrome.runtime.getManifest().version });
        await closePopupWindows();
    }
});

function setUninstallUrl() {
	var uninstallUrl = `https://sitenavigator.co/feedback`;
	try {
		chrome.runtime.setUninstallURL(uninstallUrl);
	} catch (err) {
		console.error('Error setting uninstall page', err);
	}
}