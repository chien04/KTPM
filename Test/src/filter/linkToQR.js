const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

/**
 * Tạo mã QR từ một URL và lưu vào file
 * @param {string} url - URL cần chuyển đổi thành mã QR
 * @param {Object} options - Tùy chọn
 * @param {string} options.outputDir - Thư mục đầu ra để lưu file QR
 * @param {string} options.filename - Tên file đầu ra (không bao gồm đường dẫn)
 * @returns {Promise<string>} - Đường dẫn đến file QR đã tạo
 */
async function generateQRCode(url, options = {}) {
  const outputDir = options.outputDir || path.join(__dirname, '..', 'qrcodes');
  const filename = options.filename || `qr-${Date.now()}.png`;
  
  // Đảm bảo thư mục đầu ra tồn tại
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, filename);
  
  // Tùy chọn cho QR code
  const qrOptions = {
    errorCorrectionLevel: 'H',
    type: 'png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };
  
  // Tạo và lưu QR code
  await QRCode.toFile(outputPath, url, qrOptions);
  
  return outputPath;
}

module.exports = {
  generateQRCode
};