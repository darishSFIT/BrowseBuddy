document.addEventListener("DOMContentLoaded", () => {
  let qrcode = document.querySelector("img");
  let text = document.querySelector("input");
  let generateBtn = document.querySelector(".generate");
  let downloadBtn = document.querySelector(".download");
  let getUrlBtn = document.querySelector(".get-url");

  // We are using api.qrserver.com API to generate QR.
  generateBtn.addEventListener("click", () => {
    let data = text.value;
    if (data.trim() != "") {
      let baseURL = "https://api.qrserver.com/v1/create-qr-code/";
      let url = `${baseURL}?data=${encodeURI(data)}&margin=10`;
      qrcode.src = url;
    }
  });

  // When user clicks on Get Current Tab URL button
  getUrlBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentUrl = tabs[0].url;
      text.value = currentUrl; // Set the input field to the current tab URL
      generateBtn.click(); // Automatically generate QR code for the current URL
    });
  });

  // When user clicks on Download button
  downloadBtn.addEventListener("click", () => {
    generateBtn.click();
    let data = text.value;
    if (data.trim() != "") {
      let baseURL = "https://api.qrserver.com/v1/create-qr-code/";
      let url = `${baseURL}?data=${encodeURI(data)}&margin=10`;
      fetch(url)
        .then((resp) => resp.blob())
        .then((blobobject) => {
          let anchor = document.createElement("a");
          anchor.style.display = "none";
          const blob = window.URL.createObjectURL(blobobject);
          anchor.href = blob;
          anchor.download = "qrcode.png";
          anchor.click();
        })
        .catch(() => (text.value = ""));
    }
  });
});
