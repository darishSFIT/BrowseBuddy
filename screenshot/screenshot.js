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




//dangerous code


// let currentScreenshot;
// let isSelecting = false;
// let startX, startY;

// const selectionBox = document.createElement('div');
// selectionBox.id = 'selectionBox';
// selectionBox.style.position = 'fixed';
// selectionBox.style.border = '2px dashed red';
// selectionBox.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
// selectionBox.style.display = 'none';
// document.body.appendChild(selectionBox);

// function startSelection() {
//     isSelecting = true;
//     document.body.style.cursor = 'crosshair';
//     selectionBox.style.display = 'block';
// }

// function updateSelectionBox(e) {
//     if (!isSelecting) return;

//     const endX = e.clientX;
//     const endY = e.clientY;

//     const left = Math.min(startX, endX);
//     const top = Math.min(startY, endY);
//     const width = Math.abs(endX - startX);
//     const height = Math.abs(endY - startY);

//     selectionBox.style.left = `${left}px`;
//     selectionBox.style.top = `${top}px`;
//     selectionBox.style.width = `${width}px`;
//     selectionBox.style.height = `${height}px`;
// }

// function endSelection() {
//     isSelecting = false;
//     document.body.style.cursor = 'default';
// }

// function takeScreenshot() {
//     const rect = selectionBox.getBoundingClientRect();
//     html2canvas(document.body, {
//         x: rect.left,
//         y: rect.top,
//         width: rect.width,
//         height: rect.height,
//         scrollX: window.scrollX,
//         scrollY: window.scrollY
//     }).then(canvas => {
//         currentScreenshot = canvas.toDataURL();
//         displayScreenshot(currentScreenshot);
//         selectionBox.style.display = 'none';
//     });
// }

// function displayScreenshot(dataUrl) {
//     const img = document.createElement('img');
//     img.src = dataUrl;
//     img.style.maxWidth = '100%';
//     img.style.border = '1px solid #ccc';
//     const screenshotContainer = document.getElementById('screenshotContainer');
//     screenshotContainer.innerHTML = ''; // Clear previous screenshot
//     screenshotContainer.appendChild(img);
// }

// function retakeScreenshot() {
//     currentScreenshot = null;
//     document.getElementById('screenshotContainer').innerHTML = ''; // Clear displayed screenshot
//     selectionBox.style.display = 'none';
// }

// function copyScreenshot() {
//     navigator.clipboard.write([
//         new ClipboardItem({
//             'image/png': fetch(currentScreenshot).then(res => res.blob())
//         })
//     ]).then(() => {
//         alert('Screenshot copied to clipboard!');
//     });
// }

// function downloadScreenshot() {
//     const link = document.createElement('a');
//     link.href = currentScreenshot;
//     link.download = 'screenshot.png';
//     link.click();
// }

// // Event listeners
// document.addEventListener('mousedown', (e) => {
//     startX = e.clientX;
//     startY = e.clientY;
//     startSelection();
// });

// document.addEventListener('mousemove', updateSelectionBox);

// document.addEventListener('mouseup', () => {
//     endSelection();
//     if (selectionBox.style.width !== '0px' && selectionBox.style.height !== '0px') {
//         takeScreenshot();
//     }
// });

// document.getElementById('retakeScreenshotBtn').addEventListener('click', retakeScreenshot);
// document.getElementById('copyScreenshotBtn').addEventListener('click', copyScreenshot);
// document.getElementById('downloadScreenshotBtn').addEventListener('click', downloadScreenshot);