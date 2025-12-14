// Content script for Firefox add-on
// Handles QR code generation and display on the webpage

// Create QR code container element
function createQRContainer() {
  const container = document.createElement('div');
  container.id = 'qr-code-container';
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  container.style.backgroundColor = 'white';
  container.style.padding = '10px';
  container.style.borderRadius = '5px';
  container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  container.style.display = 'none';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '5px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => {
    container.style.display = 'none';
  };
  
  const qrCodeElement = document.createElement('div');
  qrCodeElement.id = 'qr-code-element';
  qrCodeElement.style.width = '200px';
  qrCodeElement.style.height = '200px';
  
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Save QR Code';
  downloadBtn.style.display = 'block';
  downloadBtn.style.marginTop = '10px';
  downloadBtn.style.padding = '5px 10px';
  downloadBtn.style.backgroundColor = '#4CAF50';
  downloadBtn.style.color = 'white';
  downloadBtn.style.border = 'none';
  downloadBtn.style.borderRadius = '3px';
  downloadBtn.style.cursor = 'pointer';
  
  container.appendChild(closeBtn);
  container.appendChild(qrCodeElement);
  container.appendChild(downloadBtn);
  
  document.body.appendChild(container);
  
  return { container, qrCodeElement, downloadBtn };
}

// Initialize QR code generator
let qrGenerator = null;
let qrContainer = null;

// Listen for messages from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "generateQRCode") {
    // Create container if it doesn't exist
    if (!qrContainer) {
      qrContainer = createQRContainer();
      qrGenerator = new QRCodeGenerator();
    }
    
    // Show container and generate QR code
    qrContainer.container.style.display = 'block';
    
    // Generate QR code
    qrGenerator.generateQRCode(message.url, 'qr-code-element').then(() => {
      // Set up download button
      qrContainer.downloadBtn.onclick = async () => {
        const svgData = await qrGenerator.getSVGData();
        if (svgData) {
          // Create a blob and download link
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          
          // Create a temporary anchor element
          const a = document.createElement('a');
          a.href = url;
          a.download = 'page-qr-code.svg';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Clean up
          URL.revokeObjectURL(url);
        }
      };
    });
  }
});

// Clean up when page is unloaded
window.addEventListener('beforeunload', () => {
  if (qrContainer && qrContainer.container) {
    qrContainer.container.remove();
  }
});