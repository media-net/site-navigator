document.addEventListener('DOMContentLoaded', function() {
    const toggleCheckbox = document.querySelector('.toggle-checkbox');

    loadFeatureState();

    if (toggleCheckbox) {
        toggleCheckbox.addEventListener('change', function() {
            const isEnabled = toggleCheckbox.checked;
            console.log('Feature toggled:', isEnabled);

            // Send message to background script to update state
            chrome.runtime.sendMessage(
                { 
                    type: 'SET_FEATURE_STATE', 
                    enabled: isEnabled 
                },
                function(response) {
                    if (response && response.success) {
                        console.log('Feature state updated successfully');
                    }
                }
            );
        });
    }
});


function loadFeatureState() {
    chrome.runtime.sendMessage(
        { type: 'GET_FEATURE_STATE' },
        function(response) {
            const toggleCheckbox = document.querySelector('.toggle-checkbox');
            if (toggleCheckbox && response) {
                toggleCheckbox.checked = response.enabled ?? false;
                console.log('Feature state loaded:', response.enabled);
            }
        }
    );
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updatePopup') {
        console.log('Received update from background:', request.data);
        sendResponse({ status: 'received' });
    }
    return true;
});

