// Background script for Firefox add-on
// Handles context menu integration and messaging

// Create context menu item when extension is installed
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "generate-qr-code",
    title: "Generate QR Code for this page",
    contexts: ["page"]
  });
});

// Handle context menu item click
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generate-qr-code") {
    // Send message to content script to generate QR code
    browser.tabs.sendMessage(tab.id, {
      action: "generateQRCode",
      url: tab.url
    });
  }
});

// Handle messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "downloadQRCode") {
    // Handle QR code download
    const svgData = message.svgData;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    browser.downloads.download({
      url: url,
      filename: 'page-qr-code.svg',
      saveAs: true
    });
  }
});