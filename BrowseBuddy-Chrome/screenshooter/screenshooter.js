document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('screenshotCanvas');
    const ctx = canvas.getContext('2d');
    let img = new Image();
  
    chrome.tabs.captureVisibleTab(null, {}, function (screenshotUrl) {
      if (screenshotUrl) {
        img.src = screenshotUrl; // Use the captured screenshot URL
        img.onload = function () {
          const scale = window.devicePixelRatio;
          canvas.width = img.width / scale;
          canvas.height = img.height / scale;
          ctx.drawImage(img, 0, 0, img.width / scale, img.height / scale);
        };
      }
    });
  
    let isCropping = false;
    let cropRect = {};
  
    canvas.addEventListener('mousedown', (e) => {
      isCropping = true;
      const rect = canvas.getBoundingClientRect();
      cropRect.startX = e.clientX - rect.left;
      cropRect.startY = e.clientY - rect.top;
    });
  
    canvas.addEventListener('mousemove', (e) => {
      if (isCropping) {
        const rect = canvas.getBoundingClientRect();
        cropRect.width = e.clientX - rect.left - cropRect.startX;
        cropRect.height = e.clientY - rect.top - cropRect.startY;
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropRect.startX, cropRect.startY, cropRect.width, cropRect.height);
      }
    });
  
    canvas.addEventListener('mouseup', (e) => {
      isCropping = false;
    });
  
    document.getElementById('cropBtn').addEventListener('click', function () {
      const cropCanvas = document.createElement('canvas');
      const cropCtx = cropCanvas.getContext('2d');
  
      cropCanvas.width = cropRect.width;
      cropCanvas.height = cropRect.height;
      
      cropCtx.drawImage(
        canvas,
        cropRect.startX,
        cropRect.startY,
        cropRect.width,
        cropRect.height,
        0,
        0,
        cropRect.width,
        cropRect.height
      );
  
      const croppedImage = cropCanvas.toDataURL();
      const link = document.createElement('a');
      const now = new Date();
      const fileName = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`; // Updated filename format
      link.href = croppedImage;
      link.download = `screenshot_${fileName}.png`; // Specify the filename for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
  
