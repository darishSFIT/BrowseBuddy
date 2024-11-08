// Get the button and status elements
const toggleButton = document.getElementById('toggleButton');
const adblockStatus = document.getElementById('adblockStatus');

// Update the way to access storage for Manifest V2
browser.storage.local.get(['adblockEnabled']).then((result) => {
    const isEnabled = result.adblockEnabled !== undefined ? result.adblockEnabled : true; // Default to true if not set
    updateUI(isEnabled);
});

// Handle the toggle button click
toggleButton.addEventListener('click', () => {
    browser.storage.local.get(['adblockEnabled']).then((result) => {
        const isEnabled = result.adblockEnabled !== undefined ? result.adblockEnabled : true; // Default to true if not set
        const newStatus = !isEnabled;

        // Update status in local storage and background
        browser.storage.local.set({ adblockEnabled: newStatus }).then(() => {
            updateUI(newStatus);
            // Use the correct messaging format for Manifest V2
            browser.runtime.sendMessage({ action: newStatus ? 'enable' : 'disable' });
        });
    });
});

function updateUI(isEnabled) {
    adblockStatus.textContent = isEnabled ? 'Enabled' : 'Disabled';
    toggleButton.textContent = isEnabled ? 'Disable AdBlocker' : 'Enable AdBlocker';
}
