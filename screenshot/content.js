(function() {
    let start = {};
    let end = {};
    let isSelecting = false;
    let selection;
    let options;
  
    function initializeScreenshot() {
      if (!document.getElementById('extension-selection')) {
        const selectionDiv = document.createElement('div');
        selectionDiv.id = 'extension-selection';
        document.body.appendChild(selectionDiv);
  
        const optionsDiv = document.createElement('div');
        optionsDiv.id = 'screenshot-options';
        optionsDiv.style.display = 'none';
        optionsDiv.innerHTML = `
          <button id="retake">Retake</button>
          <button id="copy">Copy</button>
          <button id="download">Download</button>
        `;
        document.body.appendChild(optionsDiv);
      }
      selection = document.getElementById('extension-selection');
      options = document.getElementById('screenshot-options');
  
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('keydown', handleKeyDown);
  
      document.getElementById('retake').addEventListener('click', retakeScreenshot);
      document.getElementById('copy').addEventListener('click', copyScreenshot);
      document.getElementById('download').addEventListener('click', downloadScreenshot);
    }
  
    function handleMouseDown(event) {
      isSelecting = true;
      selection.classList.remove('complete');
      start.x = event.pageX;
      start.y = event.pageY;
      
      selection.style.left = `${start.x}px`;
      selection.style.top = `${start.y}px`;
      selection.style.width = '0px';
      selection.style.height = '0px';
      selection.style.display = 'block';
      options.style.display = 'none';
    }
  
    function handleMouseMove(event) {
      if (!isSelecting) return;
      
      end.x = event.pageX;
      end.y = event.pageY;
      
      selection.style.left = `${Math.min(start.x, end.x)}px`;
      selection.style.top = `${Math.min(start.y, end.y)}px`;
      selection.style.width = `${Math.abs(start.x - end.x)}px`;
      selection.style.height = `${Math.abs(start.y - end.y)}px`;
    }
  
    function handleMouseUp() {
      if (!isSelecting) return;
      isSelecting = false;
      selection.classList.add('complete');
      captureScreenshot();
    }
  
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        cleanup();
      }
    }
  
    function captureScreenshot() {
      const captureArea = selection.getBoundingClientRect();
      chrome.runtime.sendMessage({
        action: "captureScreenshot",
        area: {
          x: Math.round(captureArea.left),
          y: Math.round(captureArea.top),
          width: Math.round(captureArea.width),
          height: Math.round(captureArea.height)
        }
      }, (response) => {
        if (response && response.dataUrl) {
          window.screenshotDataUrl = response.dataUrl;
          showOptions();
        }
      });
    }
  
    function showOptions() {
      const selectionPos = selection.getBoundingClientRect();
      options.style.display = 'block';
      options.style.position = 'absolute';
      options.style.left = `${selectionPos.left}px`;
      options.style.top = `${selectionPos.bottom + 10}px`;
    }
  
    function retakeScreenshot() {
      cleanup();
      initializeScreenshot();
    }
  
    function copyScreenshot() {
      chrome.runtime.sendMessage({
        action: "copyToClipboard",
        dataUrl: window.screenshotDataUrl
      });
    }
  
    function downloadScreenshot() {
      chrome.runtime.sendMessage({
        action: "downloadScreenshot",
        dataUrl: window.screenshotDataUrl
      });
    }
  
    function cleanup() {
      selection.style.display = 'none';
      options.style.display = 'none';
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    }
  
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === "initializeScreenshot") {
        initializeScreenshot();
      }
    });
  })();