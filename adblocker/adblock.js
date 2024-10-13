
document.addEventListener('DOMContentLoaded', function () {
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

    // Update the UI based on the adblocker status
    function updateUI(isEnabled) {
        if (isEnabled) {
            adblockStatus.textContent = 'Enabled';
            toggleButton.textContent = 'Disable AdBlocker';
            toggleButton.classList.remove('button-on');
            toggleButton.classList.add('button-off');
        } else {
            adblockStatus.textContent = 'Disabled';
            toggleButton.textContent = 'Enable AdBlocker';
            toggleButton.classList.remove('button-off');
            toggleButton.classList.add('button-on');
        }
    }
});
