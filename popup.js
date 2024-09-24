document.addEventListener('DOMContentLoaded', function () {
    // Get the current active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabUrl = tabs[0].url;
        
        // Show the URL in the popup
        document.getElementById('safety-status').textContent = `Current URL: ${tabUrl}`;
        
        // Get the stored safety score from localStorage
        const savedScore = localStorage.getItem(tabUrl);
        if (savedScore) {
            document.getElementById('score').value = savedScore;  // Display the saved score in the input
            document.getElementById('safety-status').textContent = `Safety Score: ${savedScore} (URL: ${tabUrl})`;
        } else {
            document.getElementById('safety-status').textContent = `No safety score submitted for: ${tabUrl}`;
        }
    });

    // Submit safety score
    document.getElementById('submitScore').addEventListener('click', function () {
        const score = document.getElementById('score').value;
        if (score >= 0 && score <= 100) {
            // Get the current active tab's URL
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const tabUrl = tabs[0].url;
                
                // Save the score for the current page in local storage
                localStorage.setItem(tabUrl, score);
                
                // Notify the content script to update the score
                chrome.tabs.sendMessage(tabs[0].id, { action: 'updateScore', score: score });
                
                // Update the popup to show the saved score
                document.getElementById('safety-status').textContent = `Safety Score Submitted: ${score} (URL: ${tabUrl})`;
            });
        } else {
            alert('Please enter a valid score between 0 and 100.');
        }
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentTab = tabs[0];
//       const url = new URL(currentTab.url).hostname;

//       fetchSafetyScore(url).then(scoreData => {
//           displaySafetyStatus(scoreData.score, scoreData.message);
//           setIcon(scoreData.score);
//       });

//       document.getElementById("submitScore").addEventListener("click", () => {
//           const score = document.getElementById("score").value;
//           chrome.runtime.sendMessage({
//               action: "submitSafetyScore",
//               url: url,
//               score: score,
//               user: "currentUser"
//           }, (response) => {
//               alert(response.message);
//               displaySafetyStatus(score, response.message);
//               setIcon(score);
//           });
//       });

//       document.getElementById("viewReport").addEventListener("click", () => {
//           fetch(`https://browsebuddy.onrender.com/api/report?url=${url}`)
//               .then(response => response.json())
//               .then(data => {
//                   document.getElementById("report").innerText = JSON.stringify(data, null, 2);
//               });
//       });
//   });
// });

// function displaySafetyStatus(score, message) {
//   const safetyStatus = document.getElementById("safety-status");
//   const statusIcon = document.createElement("img");
//   let statusMessage = "";

//   if (score === "Not reviewed") {
//       safetyStatus.style.backgroundColor = "yellow";
//       safetyStatus.style.color = "black";
//       statusIcon.src = "icons/icon_yellow.png";
//       statusMessage = "Safety Score: Not reviewed";
//   } else if (score < 50) {
//       safetyStatus.style.backgroundColor = "red";
//       safetyStatus.style.color = "white";
//       statusIcon.src = "icons/icon_red.png";
//       statusMessage = `Safety Score: ${score} (Unsafe)`;
//   } else {
//       safetyStatus.style.backgroundColor = "green";
//       safetyStatus.style.color = "white";
//       statusIcon.src = "icons/icon_green.png";
//       statusMessage = `Safety Score: ${score} (Safe)`;
//   }

//   safetyStatus.innerText = `${statusMessage}\n${message}`;
//   safetyStatus.prepend(statusIcon);
// }

// function setIcon(score) {
//   let iconPath = "icons/icon_green.png";
//   if (score === "Not reviewed") {
//       iconPath = "icons/icon_yellow.png";
//   } else if (score < 50) {
//       iconPath = "icons/icon_red.png";
//   }
//   chrome.action.setIcon({ path: iconPath });
// }

// function fetchSafetyScore(url) {
//   return new Promise((resolve, reject) => {
//       chrome.runtime.sendMessage({ action: 'getSafetyScore', url }, (response) => {
//           if (response && response.score !== undefined) {
//               resolve(response);
//           } else {
//               resolve({ score: "Not reviewed", message: "" });
//           }
//       });
//   });
// }
