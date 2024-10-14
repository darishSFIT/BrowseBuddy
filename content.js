const displayScore = (score) => {
    const scoreBadge = document.createElement('div');
    scoreBadge.innerText = `Safety Score: ${score}`;
    scoreBadge.className = 'fixed top-0 right-0 m-4 p-2 bg-blue-500 text-white rounded shadow-lg';
    document.body.appendChild(scoreBadge);
};

// Function to fetch and display the safety score
const fetchAndDisplaySafetyScore = () => {
    const currentUrl = window.location.href;

    chrome.storage.local.get(currentUrl, (data) => {
        if (data[currentUrl]) {
            displayScore(data[currentUrl]);
        } else {
            displayScore("Not reviewed");
        }
    });
};

// Listen for updates to the score
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateScore') {
        displayScore(request.score); // Update badge with new score
    }
});

// Initial fetch and display of the safety score
fetchAndDisplaySafetyScore();
