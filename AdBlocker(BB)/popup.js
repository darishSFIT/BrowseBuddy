// Get the button and status elements
const toggleButton = document.getElementById('toggleButton');
const adblockStatus = document.getElementById('adblockStatus');

// Check current status on load
chrome.storage.local.get(['adblockEnabled'], (result) => {
    const isEnabled = result.adblockEnabled !== false;
    updateUI(isEnabled);
});

// Handle the toggle button click
toggleButton.addEventListener('click', () => {
    chrome.storage.local.get(['adblockEnabled'], (result) => {
        const isEnabled = result.adblockEnabled !== false;
        const newStatus = !isEnabled;

        // Update status in local storage and background
        chrome.storage.local.set({ adblockEnabled: newStatus }, () => {
            updateUI(newStatus);
            chrome.runtime.sendMessage({ action: newStatus ? 'enable' : 'disable' });
        });
    });
});

function updateUI(isEnabled) {
    adblockStatus.textContent = isEnabled ? 'Enabled' : 'Disabled';
    toggleButton.textContent = isEnabled ? 'Disable AdBlocker' : 'Enable AdBlocker';
}
