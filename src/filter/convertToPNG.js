const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Chuyển đổi hình ảnh sang định dạng PNG
 * @param {string} inputPath Đường dẫn đến file ảnh đầu vào
 * @param {string} outputPath Đường dẫn đến file PNG đầu ra (tùy chọn)
 * @returns {Promise<string>} Đường dẫn đến file PNG đã tạo
 */
async function convertToPng(inputPath, outputPath) {
  try {
    // Nếu không có outputPath, tạo một outputPath mặc định
    if (!outputPath) {
      const dir = path.dirname(inputPath);
      const filename = path.basename(inputPath, path.extname(inputPath));
      outputPath = path.join(dir, `${filename}.png`);
    }

    // Sử dụng sharp để chuyển đổi ảnh sang PNG
    await sharp(inputPath)
      .png()
      .toFile(outputPath);

    console.log(`Chuyển đổi thành công: ${inputPath} -> ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Lỗi khi chuyển đổi ảnh:', error);
    throw error;
  }
}

module.exports = {
    convertToPng,
  };