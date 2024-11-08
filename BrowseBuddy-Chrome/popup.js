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

document.addEventListener('DOMContentLoaded', () => {
    const openParkBuddyLink = document.getElementById('openParkBuddy');
    const contentFrame = document.getElementById('contentFrame');

    openParkBuddyLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        contentFrame.src = "https://okay-joby-danielthatu47-210548f0.koyeb.app/"; // Set the iframe source
    });
});

document.getElementById('stop-pb').addEventListener('click', function(){
    const iframWindow = document.getElementById('contentFrame');
    iframWindow.classList.add('hidden'); 
    const stoppb = document.getElementById('stop-pb');
    stoppb.classList.add('hidden'); 
})
document.getElementById('openParkBuddy').addEventListener('click', function(){
    const iframWindow = document.getElementById('contentFrame');
    iframWindow.classList.remove('hidden'); 
    const stoppb = document.getElementById('stop-pb');
    stoppb.classList.remove('hidden'); 

})

document.getElementById('stop-ss').addEventListener('click', function(){
    const iframWindow = document.getElementById('screenshotContainer');
    iframWindow.classList.add('hidden'); 
    const stoppb = document.getElementById('stop-ss');
    stoppb.classList.add('hidden'); 
})
document.getElementById('screenshotBtn').addEventListener('click', function(){
    const iframWindow = document.getElementById('screenshotContainer');
    iframWindow.classList.remove('hidden'); 
    const stoppb = document.getElementById('stop-ss');
    stoppb.classList.remove('hidden'); 

})

// document.getElementById('advancedScreenshotBtn').addEventListener('click', function() {
//     //window.location.href = 'screenshot/screenshot.html';
//     // Define the area you want to capture
//     const x = 100; // X coordinate of the top-left corner
//     const y = 100; // Y coordinate of the top-left corner
//     const width = 200; // Width of the area to capture
//     const height = 200; // Height of the area to capture

//     // Call the function to capture the selected area
//     captureSelectedArea(x, y, width, height);
// });

// function captureSelectedArea(x, y, width, height) {
//     chrome.tabs.captureVisibleTab(null, {}, function(screenshotUrl) {
//         const img = new Image();
//         img.src = screenshotUrl;
//         img.onload = function() {
//             const canvas = document.createElement('canvas');
//             canvas.width = width;
//             canvas.height = height;
//             const ctx = canvas.getContext('2d');

//             // Draw the captured image onto the canvas, cropping to the selected area
//             ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

//             // Convert the canvas to a data URL
//             const croppedImageUrl = canvas.toDataURL('image/png');

//             // You can now use the croppedImageUrl, e.g., display it or download it
//             console.log(croppedImageUrl);
//         };
//     });
// }

// // Example usage: capture a 200x200 area starting at (100, 100)
// captureSelectedArea(100, 100, 200, 200);
