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
        enableAdBlocking();
    } else if (message.action === 'disable') {
        disableAdBlocking();
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
