// QR Code Styling library for generating QR codes
// Using qr-code-styling library for advanced QR code generation

// This is a simplified version for our Firefox add-on
// We'll use the browser-compatible version from CDN

class QRCodeGenerator {
  constructor() {
    this.qrCode = null;
  }

  async generateQRCode(url, elementId) {
    // Load the qr-code-styling library dynamically
    if (typeof QRCodeStyling === 'undefined') {
      await this.loadLibrary();
    }

    // Create QR code instance
    this.qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
      type: "svg",
      data: url,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0
      },
      dotsOptions: {
        color: '#000000',
        type: 'square'
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      cornersSquareOptions: {
        color: '#000000',
        type: 'square'
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'square'
      }
    });

    // Append to the specified element
    const container = document.getElementById(elementId);
    if (container) {
      this.qrCode.append(container);
    }

    return this.qrCode;
  }

  async loadLibrary() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async getSVGData() {
    if (!this.qrCode) return null;
    
    return new Promise((resolve) => {
      this.qrCode.getRawData('svg').then((svgData) => {
        resolve(svgData);
      });
    });
  }

  downloadSVG(filename = 'qr-code.svg') {
    if (!this.qrCode) return;
    
    this.qrCode.download({ name: filename, extension: 'svg' });
  }

  clear(elementId) {
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = '';
    }
  }
}