// Popup script for Site Navigator extension

document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('actionBtn');
    const messageDiv = document.getElementById('message');

    // Button click handler
    actionBtn.addEventListener('click', function() {
        showMessage('Button clicked successfully!', 'success');
        
        // Send message to background script
        chrome.runtime.sendMessage(
            { action: 'buttonClicked', timestamp: Date.now() },
            function(response) {
                if (response && response.status === 'success') {
                    console.log('Message sent to background script');
                }
            }
        );

        // Example: Get data from storage
        chrome.storage.local.get(['clickCount'], function(result) {
            const count = (result.clickCount || 0) + 1;
            chrome.storage.local.set({ clickCount: count }, function() {
                console.log('Click count:', count);
            });
        });
    });

    // Function to show messages
    function showMessage(text, type = 'success') {
        messageDiv.textContent = text;
        messageDiv.className = `message show ${type}`;
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 3000);
    }

    // Load initial data on popup open
    loadInitialData();
});

// Load any initial data when popup opens
function loadInitialData() {
    chrome.storage.local.get(['clickCount'], function(result) {
        const count = result.clickCount || 0;
        console.log('Total clicks so far:', count);
    });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updatePopup') {
        console.log('Received update from background:', request.data);
        sendResponse({ status: 'received' });
    }
    return true;
});

