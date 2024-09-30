document.getElementById('screenshotBtn').addEventListener('click', function() {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
        // Display the screenshot in the index.html
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.maxWidth = '100%';
        img.style.border = '1px solid #ccc';
        
        const screenshotContainer = document.getElementById('screenshotContainer');
        screenshotContainer.innerHTML = ''; // Clear previous screenshot
        screenshotContainer.appendChild(img);
    });
});

document.getElementById('advancedScreenshotBtn').addEventListener('click', function() {
    // Redirect to the screenshot.html page for advanced screenshot options
    window.location.href = 'screenshot.html';
});
