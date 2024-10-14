chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).then(() => {
      chrome.tabs.sendMessage(tab.id, {action: "initializeScreenshot"});
    });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureScreenshot") {
      chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
        cropScreenshot(dataUrl, request.area, (croppedDataUrl) => {
          sendResponse({dataUrl: croppedDataUrl});
        });
      });
      return true; // Indicates that we will send a response asynchronously
    } else if (request.action === "copyToClipboard") {
      copyToClipboard(request.dataUrl);
    } else if (request.action === "downloadScreenshot") {
      downloadScreenshot(request.dataUrl);
    }
  });
  
  function cropScreenshot(dataUrl, area, callback) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = area.width;
      canvas.height = area.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
      callback(canvas.toDataURL());
    };
    img.src = dataUrl;
  }
  
  function copyToClipboard(dataUrl) {
    const img = document.createElement('img');
    img.src = dataUrl;
    document.body.appendChild(img);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    
    canvas.toBlob((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]).then(() => {
        console.log('Image copied to clipboard');
      }).catch((error) => {
        console.error('Error copying image to clipboard:', error);
      });
    }, 'image/png');
    
    document.body.removeChild(img);
  }
  
  function downloadScreenshot(dataUrl) {
    chrome.downloads.download({
      url: dataUrl,
      filename: 'screenshot.png',
      saveAs: true
    });
  }