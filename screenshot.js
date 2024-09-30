let currentScreenshot;

function takeScreenshot(fullPage) {
    const element = fullPage ? document.body : document.getElementById('screenshotArea');
    html2canvas(element).then(canvas => {
        currentScreenshot = canvas.toDataURL();
        displayScreenshot(currentScreenshot);
    });
}

function displayScreenshot(dataUrl) {
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.border = '1px solid #ccc';
    const screenshotContainer = document.getElementById('screenshotContainer');
    screenshotContainer.innerHTML = ''; // Clear previous screenshot
    screenshotContainer.appendChild(img);
}

function retakeScreenshot() {
    currentScreenshot = null;
    document.getElementById('screenshotContainer').innerHTML = ''; // Clear displayed screenshot
}

function copyScreenshot() {
    navigator.clipboard.write([
        new ClipboardItem({
            'image/png': fetch(currentScreenshot).then(res => res.blob())
        })
    ]).then(() => {
        alert('Screenshot copied to clipboard!');
    });
}

function downloadScreenshot() {
    const link = document.createElement('a');
    link.href = currentScreenshot;
    link.download = 'screenshot.png';
    link.click();
}

// Event listeners for buttons
document.getElementById('selectiveScreenshotBtn').addEventListener('click', function() {
    takeScreenshot(false);
});

document.getElementById('fullScreenshotBtn').addEventListener('click', function() {
    takeScreenshot(true);
});

document.getElementById('retakeScreenshotBtn').addEventListener('click', retakeScreenshot);
document.getElementById('copyScreenshotBtn').addEventListener('click', copyScreenshot);
document.getElementById('downloadScreenshotBtn').addEventListener('click', downloadScreenshot);
