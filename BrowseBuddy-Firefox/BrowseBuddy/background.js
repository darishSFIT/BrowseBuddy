// Initialize storage on installation
browser.runtime.onInstalled.addListener(() => {
    console.log("BrowseBuddy extension installed");
});

// ss-cropping
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "capture_tab") {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      let tabId = tabs[0].id;
      
      browser.tabs.captureVisibleTab(
        tabId,
        { format: "png", quality: 100 }
      ).then((dataUrl) => {
        sendResponse({ imgSrc: dataUrl });
      });
    });
    return true; // To ensure the sendResponse callback remains valid
  }
});

// ADBLOCKER LOGIC 
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
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ adblockEnabled: true }).then(() => {
      enableAdBlocking();
  });
});

// Message handler for enabling or disabling the ad blocker
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'enable') {
      enableAdBlocking();
  } else if (message.action === 'disable') {
      disableAdBlocking();
  }
});

function enableAdBlocking() {
  // Remove existing rules first to avoid conflicts
  browser.declarativeNetRequest.getDynamicRules().then((rules) => {
      const existingRuleIds = rules.map(rule => rule.id);
      
      browser.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: existingRuleIds,  // Remove all existing rules
          addRules: adRules                // Add new ad-blocking rules
      }).then(() => {
          console.log("Ad blocking enabled.");
      });
  });
}

function disableAdBlocking() {
  browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3]  // Remove all ad-blocking rules
  }).then(() => {
      console.log("Ad blocking disabled.");
  });
}

// Context menu creation
browser.runtime.onInstalled.addListener(function() {
    browser.contextMenus.create({
      id: "summarize",
      title: "Summarize text",
      contexts: ["selection"]
    });
    browser.contextMenus.create({
      id: "translate",
      title: "Translate text",
      contexts: ["selection"]
    });
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
    browser.storage.sync.get(['apiKey']).then((result) => {
      if (!result.apiKey) {
        console.error('API key not found. Please set your OpenAI API key in the extension popup.');
        return;
      }
  
      const selectedText = info.selectionText;
      let prompt;
      let action;
  
      if (info.menuItemId === "summarize") {
        prompt = `Please explain the following text:\n\n${selectedText}`;
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
    browser.scripting.executeScript({
      target: { tabId: tabId },
      func: (actionType, text) => {
        console.log(`ChatGPT ${actionType} Result:`, text);
      },
      args: [action, result]
    });
    
    // Create a notification with the result
    browser.notifications.create({
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
