let startX, startY, endX, endY;
let selectionBox;

document.getElementById('screenshotBtn').addEventListener('click', function() {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.maxWidth = '100%';
        img.style.border = '1px solid #ccc';

        const screenshotContainer = document.getElementById('screenshotArea');
        screenshotContainer.innerHTML = ''; // Clear previous screenshot
        screenshotContainer.appendChild(img);
        screenshotContainer.classList.remove('hidden'); // Show the screenshot area
    });
});

document.getElementById('advancedScreenshotBtn').addEventListener('click', function() {
    // Clear any existing selection
    if (selectionBox) {
        selectionBox.remove();
    }

    // Create a new selection box
    selectionBox = document.createElement('div');
    selectionBox.className = 'selection';
    document.body.appendChild(selectionBox);

    // Show the screenshot area
    const screenshotContainer = document.getElementById('screenshotArea');
    screenshotContainer.classList.remove('hidden'); // Show the screenshot area

    // Add mouse event listeners
    document.addEventListener('mousedown', startSelection);
    document.addEventListener('mousemove', updateSelection);
    document.addEventListener('mouseup', endSelection);
});

document.getElementById('stop-ss').addEventListener('click', function(){
    const screenshotContainer = document.getElementById('screenshotArea');
    screenshotContainer.classList.add('hidden'); // Show the screenshot area
})

function startSelection(e) {
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0';
    selectionBox.style.height = '0';
}

function updateSelection(e) {
    if (!startX || !startY) return;

    endX = e.clientX;
    endY = e.clientY;

    const width = endX - startX;
    const height = endY - startY;

    selectionBox.style.width = `${Math.abs(width)}px`;
    selectionBox.style.height = `${Math.abs(height)}px`;
    selectionBox.style.left = `${width < 0 ? endX : startX}px`;
    selectionBox.style.top = `${height < 0 ? endY : startY}px`;
}

function endSelection() {
    if (!startX || !startY) return;

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    // Capture the selected area
    captureSelectedArea(x, y, width, height);

    // Reset selection
    startX = startY = endX = endY = null;
    selectionBox.remove();
    selectionBox = null;
}

function captureSelectedArea(x, y, width, height) {
    chrome.tabs.captureVisibleTab(null, {}, function(screenshotUrl) {
        const img = new Image();
        img.src = screenshotUrl;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Draw the captured image onto the canvas, cropping to the selected area
            ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

            // Convert the canvas to a data URL
            const croppedImageUrl = canvas.toDataURL('image/png');

            // Display the cropped image in the screenshotArea
            const croppedImg = document.createElement('img');
            croppedImg.src = croppedImageUrl;
            croppedImg.style.maxWidth = '100%';
            croppedImg.style.border = '1px solid #ccc';

            const screenshotContainer = document.getElementById('screenshotArea');
            screenshotContainer.innerHTML = ''; // Clear previous screenshot
            screenshotContainer.appendChild(croppedImg);
        };
    });
}
