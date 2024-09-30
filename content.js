const displayScore = (score) => {
    const scoreBadge = document.createElement('div');
    scoreBadge.innerText = `Safety Score: ${score}`;
    scoreBadge.className = 'fixed top-0 right-0 m-4 p-2 bg-blue-500 text-white rounded shadow-lg';
    document.body.appendChild(scoreBadge);
};

// Get the current URL
const currentUrl = window.location.href;

// Retrieve score from chrome storage
chrome.storage.local.get(currentUrl, (data) => {
    if (data[currentUrl]) {
        displayScore(data[currentUrl]);
    }
});

// Listen for updates to the score
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateScore') {
        displayScore(request.score); // Update badge with new score
    }
});

(function () {
   
   
   
   
        function injectSafetyBadge(score, message) {
            let badge = document.getElementById('safety-badge');
            
            // Create the badge if it doesn't exist
            if (!badge) {
                badge = document.createElement('div');
                badge.id = 'safety-badge';
                badge.style.position = 'fixed'; // Fixed position
                badge.style.bottom = '10px'; // 10px from the bottom
                badge.style.right = '10px'; // 10px from the right
                badge.style.padding = '10px 15px'; // Padding for the badge
                badge.style.borderRadius = '5px'; // Rounded corners
                badge.style.zIndex = '10000'; // High z-index to stay on top
                badge.style.fontWeight = 'bold'; // Bold text
                badge.style.fontSize = '14px'; // Font size
                badge.style.transition = 'opacity 0.3s'; // Smooth transition for visibility
                document.body.appendChild(badge);
            }
      
            // Set badge styles and text based on the score
            if (score === "Not reviewed") {
                badge.style.backgroundColor = 'yellow'; // Yellow for not reviewed
                badge.style.color = 'black'; // Black text
                badge.innerText = 'Safety Score: Not reviewed';
            } else if (score < 50) {
                badge.style.backgroundColor = 'red'; // Red for unsafe
                badge.style.color = 'white'; // White text
                badge.innerText = `Safety Score: ${score} (Unsafe)`;
            } else {
                badge.style.backgroundColor = 'green'; // Green for safe
                badge.style.color = 'white'; // White text
                badge.innerText = `Safety Score: ${score} (Safe)`;
            }
      
            badge.innerText += `\n${message || ''}`; // Append any additional message
        }
      


        function fetchAndDisplaySafetyScore() {
            const url = location.hostname; // Get the current hostname
      
            chrome.runtime.sendMessage({ action: 'getSafetyScore', url }, (response) => {
                if (response && response.score !== undefined) {
                    injectSafetyBadge(response.score, response.message); // Inject badge with score
                } else {
                    injectSafetyBadge('Not reviewed'); // Default to not reviewed
                }
            });
        }
      
        fetchAndDisplaySafetyScore(); // Call the function to fetch and display score
      
        // Listen for updates to the score and re-inject the badge
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'updateSafetyScore') {
                injectSafetyBadge(request.score, request.message); // Update badge with new score
            }
        });
   
    // Function to create and inject the safety badge
    function createSafetyBadge() {
        let badge = document.createElement('div');
        badge.id = 'safety-badge';
        badge.style.position = 'fixed'; // Fixed position
        badge.style.bottom = '10px'; // 10px from the bottom
        badge.style.right = '10px'; // 10px from the right
        badge.style.padding = '10px 15px'; // Padding for the badge
        badge.style.borderRadius = '5px'; // Rounded corners
        badge.style.zIndex = '10000'; // High z-index to stay on top
        badge.style.fontWeight = 'bold'; // Bold text
        badge.style.fontSize = '14px'; // Font size
        badge.style.transition = 'opacity 0.3s'; // Smooth transition for visibility
        badge.innerText = 'Safety Score: Not reviewed'; // Default text
        badge.style.backgroundColor = 'yellow'; // Default background color
        badge.style.color = 'black'; // Default text color
        document.body.appendChild(badge);
        return badge;
    }

    // Function to update the badge based on the score
    function updateSafetyBadge(badge, score, message) {
        if (score === "Not reviewed") {
            badge.style.backgroundColor = 'yellow'; // Yellow for not reviewed
            badge.style.color = 'black'; // Black text
            badge.innerText = 'Safety Score: Not reviewed';
        } else if (score < 50) {
            badge.style.backgroundColor = 'red'; // Red for unsafe
            badge.style.color = 'white'; // White text
            badge.innerText = `Safety Score: ${score} (Unsafe)`;
        } else {
            badge.style.backgroundColor = 'green'; // Green for safe
            badge.style.color = 'white'; // White text
            badge.innerText = `Safety Score: ${score} (Safe)`;
        }

        badge.innerText += `\n${message || ''}`; // Append any additional message
    }

    // Fetch and inject the safety score badge
    function fetchAndDisplaySafetyScore(badge) {
        const url = location.hostname; // Get the current hostname

        chrome.runtime.sendMessage({ action: 'getSafetyScore', url }, (response) => {
            if (response && response.score !== undefined) {
                updateSafetyBadge(badge, response.score, response.message); // Update badge with score
            } else {
                updateSafetyBadge(badge, 'Not reviewed'); // Default to not reviewed
            }
        });
    }

    // Create the badge and fetch the initial score
    const badge = createSafetyBadge();
    fetchAndDisplaySafetyScore(badge); // Call the function to fetch and display score

    // Listen for updates to the score and re-inject the badge
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'updateSafetyScore') {
            updateSafetyBadge(badge, request.score, request.message); // Update badge with new score
        }
    });

    // Function to allow user to enter a score
    function allowUserScoreInput() {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter Safety Score (0-100)';
        input.style.position = 'fixed';
        input.style.bottom = '50px'; // Position above the badge
        input.style.right = '10px'; // Align with the badge
        input.style.zIndex = '10000'; // High z-index to stay on top
        document.body.appendChild(input);

        const button = document.createElement('button');
        button.innerText = 'Submit Score';
        button.style.position = 'fixed';
        button.style.bottom = '50px'; // Position above the badge
        button.style.right = '150px'; // Position next to the input
        button.style.zIndex = '10000'; // High z-index to stay on top
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            const score = parseInt(input.value);
            if (score >= 0 && score <= 100) {
                updateSafetyBadge(badge, score, 'User submitted score'); // Update badge with user score
                chrome.storage.local.set({ [location.hostname]: score }); // Save score in local storage
                input.value = ''; // Clear input field
            } else {
                alert('Please enter a valid score between 0 and 100.');
            }
        });
    }

    allowUserScoreInput(); // Allow user to input a score
})();
