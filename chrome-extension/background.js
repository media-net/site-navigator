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

const DOMAIN = 'sitenavigator.co';

async function setCookie(name, value) {
    try {
        await chrome.cookies.set({
            url: `https://${DOMAIN}`,
            name: name,
            value: value,
            domain: `.${DOMAIN}`,
            secure: true,
            expirationDate: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
            sameSite: "no_restriction"
        });
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
}


//Extract clean domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        let domain = urlObj.hostname;
        domain = domain.replace(/^www\./, '');
        return domain;
    } catch (error) {
        console.error('Error parsing URL:', error);
        return '';
    }
}

//Track and store the current tab's domain
async function trackCurrentTab(url) {
    if (!url){
        await setCookie('current_tab', "");
        return;
    }
    
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
        await setCookie('current_tab', "");
        return;
    }
    
    const domain = extractDomain(url);
    if (domain) {
        await setCookie('current_tab', domain);
    }
}

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        setUninstallUrl();
        await chrome.storage.sync.set({ 'feature_enabled': false });
        await setCookie('use_ac', 'false');
        
        trackActiveTab();
    } else if (details.reason === 'update') {
        setUninstallUrl();
    }
});


async function trackActiveTab() {
    try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab && activeTab.url) {
            await trackCurrentTab(activeTab.url);
        }
    } catch (error) {
        console.error('Error tracking active tab:', error);
    }
}


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        await trackCurrentTab(tab.url);
    }
});


chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab && tab.url) {
            await trackCurrentTab(tab.url);
        }
    } catch (error) {
        console.error('Error tracking activated tab:', error);
    }
});


chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        await trackActiveTab();
    }
});

async function closePopupWindows() {
    const tabs = await chrome.tabs.query({ windowType: "popup" });
    if (Array.isArray(tabs)) {
        tabs.forEach(({ id }) => chrome.tabs.remove(id));
    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_FEATURE_STATE') {
        chrome.storage.sync.get(['feature_enabled'], (result) => {
            sendResponse({ enabled: result.feature_enabled ?? false });
        });
        return true; 
    }
    
    if (message.type === 'SET_FEATURE_STATE') {
        const enabled = message.enabled;
        chrome.storage.sync.set({ 'feature_enabled': enabled }, async () => {
            await setCookie('use_ac', enabled ? 'true' : 'false');
            sendResponse({ success: true });
        });
        return true; 
    }
    
    return false;
});

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