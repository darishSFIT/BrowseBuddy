document.addEventListener('DOMContentLoaded', function () {
    // Get the current active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabUrl = tabs[0].url;
        document.getElementById('currentUrl').textContent = `Current URL: ${tabUrl}`;
        
        // Retrieve the stored safety score from local storage
        chrome.storage.local.get(tabUrl, (data) => {
            const savedScore = data[tabUrl];
            if (savedScore) {
                document.getElementById('statusMessage').textContent = `Current Safety Score: ${savedScore}`;
            } else {
                document.getElementById('statusMessage').textContent = `No safety score submitted for: ${tabUrl}`;
            }
        });
    });

    // Submit safety score
    document.getElementById('submitScore').addEventListener('click', function () {
        const score = document.getElementById('scoreInput').value;
        if (score >= 0 && score <= 100) {
            // Get the current active tab's URL
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const tabUrl = tabs[0].url;
                
                // Save the score for the current page in local storage
                chrome.storage.local.set({ [tabUrl]: score }, () => {
                    document.getElementById('statusMessage').textContent = `Score submitted: ${score} for ${tabUrl}`;
                });
            });
        } else {
            alert('Please enter a valid score between 0 and 100.');
        }
    });
});