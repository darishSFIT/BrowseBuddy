document.addEventListener('DOMContentLoaded', function () {
    const currentUrl = window.location.href;

    // Function to display safety status
    const displaySafetyStatus = (url, score) => {
        const statusContainer = document.getElementById('safetyStatusContainer');
        const statusDiv = document.createElement('div');
        statusDiv.className = 'p-4 rounded shadow';

        if (score === undefined) {
            statusDiv.className += ' bg-yellow-300'; // Not reviewed
            statusDiv.innerText = `URL: ${url} - Safety Status: Not Reviewed`;
        } else if (score < 30) {
            statusDiv.className += ' bg-red-500 text-white'; // Unsafe
            statusDiv.innerText = `URL: ${url} - Safety Status: Unsafe (Score: ${score})`;
        } else {
            statusDiv.className += ' bg-green-500 text-white'; // Safe
            statusDiv.innerText = `URL: ${url} - Safety Status: Safe (Score: ${score})`;
        }

        statusContainer.appendChild(statusDiv);
    };

    // Retrieve and display safety scores
    chrome.storage.local.get(null, (data) => {
        for (const url in data) {
            displaySafetyStatus(url, data[url]);
        }
    });

    // Submit safety score
    document.getElementById('submitScore').addEventListener('click', () => {
        const score = parseInt(document.getElementById('scoreInput').value);
        const url = window.location.href; // Get the current URL

        if (score >= 0 && score <= 100) {
            chrome.runtime.sendMessage({ action: 'submitSafetyScore', url, score }, (response) => {
                if (response.status === "success") {
                    alert(response.message);
                } else {
                    alert('Error submitting score.');
                }
            });
        } else {
            alert('Please enter a valid score between 0 and 100.');
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "getSafetyStatus") {
            chrome.storage.local.get(null, (data) => {
                for (const url in data) {
                    displaySafetyStatus(url, data[url]);
                }
                sendResponse({ status: "success" });
            });
            return true; // Keep the message channel open for sendResponse
        }
    });
});
