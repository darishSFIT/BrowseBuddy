let safetyScores = {};

// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

// Handle messages from content or popup scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "submitSafetyScore") {
        const { url, score } = request;
        safetyScores[url] = score; // Store the score in the local object
        chrome.storage.local.set({ [url]: score }, () => {
            sendResponse({ status: "success", message: "Score added successfully!" });
        });
        return true; // Keep the message channel open for sendResponse
    } else if (request.action === "getSafetyScore") {
        fetchSafetyScore(request.url).then(scoreData => {
            sendResponse(scoreData);
        }).catch(error => {
            sendResponse({ score: "Not reviewed", message: "" });
        });
        return true; // Keep the message channel open for sendResponse
    }
});

// Fetch the safety score, or retrieve it from the BrowseBuddy API if not found locally
async function fetchSafetyScore(url) {
    try {
        const response = await fetch(`https://browsebuddy.onrender.com/api/check?url=${url}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.score !== undefined) {
            return { score: data.score, message: "Fetched from API" };
        } else {
            return { score: "Not reviewed", message: "" };
        }
    } catch (error) {
        console.error('Error fetching safety score:', error);
        return { score: "Not reviewed", message: "" };
    }
}

// Submit the safety score to the BrowseBuddy API
function submitSafetyScore(url, score, user) {
    return fetch("https://browsebuddy.onrender.com/api/submit", {
        method: "POST",
        body: JSON.stringify({ url, score, user }),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.json());
}

// Notify the user about site safety
function notifyUser(message, type) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: type === 'unsafe' ? "icons/icon_red.png" : "icons/icon_green.png",
        title: "Safety Alert",
        message: message
    });
}

// Function to save score
function saveScore(url, score) {
    chrome.storage.local.set({ [url]: score });
}

// Function to retrieve score
function getScore(url, callback) {
    chrome.storage.local.get(url, (data) => {
        callback(data[url]);
    });
}

const GOOGLE_SAFE_BROWSING_API_KEY = "AIzaSyDd4dLoXFwoWf2CVSh5-QzxgAKurRkUC4A";

function checkWithGoogleSafeBrowsing(url) {
    const requestUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`;

    const body = {
        client: {
            clientId: "yourcompanyname",
            clientVersion: "1.5.2"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
        }
    };

    return fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            if (data.matches) {
                return { safe: false, data: data.matches };
            }
            return { safe: true };
        })
        .catch(error => {
            console.error('Error checking Google Safe Browsing:', error);
            return { safe: true }; // Default to safe if error
        });
}

// Usage within the checkSafety function
async function checkSafety(url) {
    // Existing logic...

    // Check with Google Safe Browsing
    const safeBrowsingResult = await checkWithGoogleSafeBrowsing(url);
    if (!safeBrowsingResult.safe) {
        notifyUser('This site is flagged by Google Safe Browsing!', 'unsafe');
    }

    // Additional logic...
}

// const VIRUSTOTAL_API_KEY = "60e36d5ffd98adaed48b99828f8689163bc43c75bc96793036b49bef4f18f17c";

// function checkWithVirusTotal(url) {
//     const requestUrl = `https://www.virustotal.com/api/v3/urls`;

//     // Encode the URL in base64
//     const urlEncoded = btoa(url);

//     return fetch(`${requestUrl}/${urlEncoded}`, {
//         method: 'GET',
//         headers: {
//             'x-apikey': VIRUSTOTAL_API_KEY
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.data.attributes.last_analysis_stats.malicious > 0) {
//                 return { safe: false, data: data.data.attributes.last_analysis_stats };
//             }
//             return { safe: true };
//         })
//         .catch(error => {
//             console.error('Error checking VirusTotal:', error);
//             return { safe: true }; // Default to safe if error
//         });
// }

// Usage within the checkSafety function
// async function checkSafety(url) {
//     // Existing logic...

//     // Check with VirusTotal
//     const virusTotalResult = await checkWithVirusTotal(url);
//     if (!virusTotalResult.safe) {
//         notifyUser('This site is flagged by VirusTotal!', 'unsafe');
//     }

//     // Additional logic...
// }





//ADBLOCKER LOGIC 

const adRules = [
    {
        "id": 1,
        "priority": 1,
        "action": { "type": "block" },
        "condition": {
            "urlFilter": "*://*.doubleclick.net/*", // DoubleClick ads
            "resourceTypes": ["script", "image", "sub_frame", "xmlhttprequest"]
        }
    },
    {
        "id": 2,
        "priority": 1,
        "action": { "type": "block" },
        "condition": {
            "urlFilter": "*://*.googlesyndication.com/*", // Google Ads
            "resourceTypes": ["script", "image", "sub_frame", "xmlhttprequest"]
        }
    },
    {
        "id": 3,
        "priority": 1,
        "action": { "type": "block" },
        "condition": {
            "urlFilter": "*://*.adservice.google.com/*", // Google Ad service
            "resourceTypes": ["script", "image", "sub_frame", "xmlhttprequest"]
        }
    }
];

// Initialize ad blocker status when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ adblockEnabled: true }, () => {
        enableAdBlocking();
    });
});

// Message handler for enabling or disabling the ad blocker
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'enable') {
        chrome.storage.local.set({ adblockEnabled: true }, enableAdBlocking);
    } else if (message.action === 'disable') {
        chrome.storage.local.set({ adblockEnabled: false }, disableAdBlocking);
    }
});

function enableAdBlocking() {
    // Remove existing rules first to avoid conflicts
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const existingRuleIds = rules.map(rule => rule.id);
        
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds,  // Remove all existing rules
            addRules: adRules                // Add new ad-blocking rules
        }, () => {
            console.log("Ad blocking enabled.");
        });
    });
}

function disableAdBlocking() {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3]  // Remove all ad-blocking rules
    }, () => {
        console.log("Ad blocking disabled.");
    });
}



chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize text",
      contexts: ["selection"]
    });
    chrome.contextMenus.create({
      id: "translate",
      title: "Translate text",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    chrome.storage.sync.get(['apiKey'], function(result) {
      if (!result.apiKey) {
        console.error('API key not found. Please set your OpenAI API key in the extension popup.');
        return;
      }
  
      const selectedText = info.selectionText;
      let prompt;
      let action;
  
      if (info.menuItemId === "summarize") {
        prompt = `Please summarize the following text:\n\n${selectedText}`;
        action = "Summary";
      } else if (info.menuItemId === "translate") {
        prompt = `Please translate the following text to English:\n\n${selectedText}`;
        action = "Translation";
      }
  
      fetchChatGPTResponse(result.apiKey, prompt, action, tab.id);
    });
  });
  
  async function fetchChatGPTResponse(apiKey, prompt, action, tabId) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      });
  
      const data = await response.json();
      const result = data.choices[0].message.content;
      
      // Log to extension's background script console
      console.log(`${action} result:`, result);
      
      // Execute a content script to log in the webpage's console
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (actionType, text) => {
          console.log(`ChatGPT ${actionType} Result:`, text);
        },
        args: [action, result]
      });
      
      // Create a notification with the result
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: `ChatGPT ${action}`,
        message: result
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing request. Please check your API key and try again.');
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/background.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
  }
