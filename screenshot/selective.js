// Things we need to keep track of
var start = {};
var end = {};
var isSelecting = false;

$(window)
    // Listen for selection
    .on('mousedown', function($event) {
        // Update our state
        isSelecting = true;
        $('#selection').removeClass('complete');
        start.x = $event.pageX;
        start.y = $event.pageY;
        
        // Display data in UI
        $('#start').text('(' + start.x + ',' + start.y + ')');
        
        // Add selection to screen
        $('#selection').css({
            left: start.x,
            top: start.y
        });
    })
    // Listen for movement
    .on('mousemove', function($event) {
        // Ignore if we're not selecing
        if (!isSelecting) { return; }
        
        // Update our state
        end.x = $event.pageX;
        end.y = $event.pageY;
        
        // Move & resize selection to reflect mouse position
        $('#selection').css({
            left: start.x < end.x ? start.x : end.x,
            top: start.y < end.y ? start.y : end.y,
            width: Math.abs(start.x - end.x),
            height: Math.abs(start.y - end.y)
        });
    })
    // listen for end
    .on('mouseup', function($event) {
        // Update our state
        isSelecting = false;
        $('#selection').addClass('complete');
        
        // Display data in UI
        $('#end').text('(' + end.x + ',' + end.y + ')');
        
        // Capture the screenshot of the selected area
        captureScreenshot();
    })
    // Add an event listener for the Enter key
    .on('keydown', function($event) {
        // Check if the Enter key (key code 13) is pressed
        if ($event.key === 'Enter' && isSelecting === false) {
            captureScreenshot(); // Call the function to capture the screenshot
        }
    });

// Function to capture the screenshot
function captureScreenshot() {
    html2canvas(document.querySelector("#selection"), {
        onrendered: function(canvas) {
            // Convert the canvas to a data URL and open it in a new window
            var imgData = canvas.toDataURL("image/png");
            var newWindow = window.open("");
            newWindow.document.write('<img src="' + imgData + '" />');
        }
    });
}
