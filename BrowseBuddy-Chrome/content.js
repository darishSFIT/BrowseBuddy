// Trigger the screenshot when the popup is opened
chrome.runtime.sendMessage(
    {
      msg: "capture_tab"
    },
    function (response) {
      // Send the image to the popup for display and cropping
      chrome.storage.local.set({ screenshot: response.imgSrc });
    }
  );
  