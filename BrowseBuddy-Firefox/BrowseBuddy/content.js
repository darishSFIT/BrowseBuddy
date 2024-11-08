// Trigger the screenshot when the popup is opened
browser.runtime.sendMessage(
    {
      msg: "capture_tab"
    },
    function (response) {
      // Send the image to the popup for display and cropping
      browser.storage.local.set({ screenshot: response.imgSrc });
    }
  );
  
