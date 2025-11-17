// Content script for Site Navigator extension
// This script runs in the context of web pages

console.log('Site Navigator content script loaded');

// Example: Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'getPageInfo') {
        // Send page information back
        sendResponse({
            title: document.title,
            url: window.location.href,
            domain: window.location.hostname
        });
    }
    
    return true;
});

// Example: Send message to background script when page loads
window.addEventListener('load', () => {
    chrome.runtime.sendMessage({
        action: 'pageLoaded',
        url: window.location.href,
        title: document.title
    });
});

// Example: You can add DOM manipulation here
// const banner = document.createElement('div');
// banner.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #667eea; color: white; padding: 10px; text-align: center; z-index: 10000;';
// banner.textContent = 'Site Navigator is active on this page';
// document.body.appendChild(banner);

