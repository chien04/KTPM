const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Tạo một link cho một file ảnh và lưu thông tin liên kết
 * @param {string} imagePath Đường dẫn đến file ảnh
 * @param {object} options Các tùy chọn
 * @param {string} options.baseUrl URL cơ sở cho liên kết (mặc định: 'http://localhost:3000')
 * @param {string} options.linksFile Đường dẫn đến file lưu trữ các liên kết (mặc định: './links.json')
 * @param {number} options.expirationDays Số ngày liên kết có hiệu lực (mặc định: 7)
 * @returns {Promise<object>} Thông tin về liên kết đã tạo
 */
async function createImageLink(imagePath, options = {}) {
  try {
    const {
      baseUrl = 'http://localhost:3000',
      linksFile = path.join(__dirname, '../data/links.json'),
      expirationDays = 7
    } = options;

    // Kiểm tra file ảnh tồn tại
    if (!fs.existsSync(imagePath)) {
      throw new Error('File ảnh không tồn tại');
    }

    // Tạo ID ngẫu nhiên cho liên kết
    const linkId = crypto.randomBytes(8).toString('hex');
    
    // Tạo thời gian hết hạn
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + expirationDays);
    
    // Tạo đối tượng liên kết
    const linkInfo = {
      id: linkId,
      originalPath: imagePath,
      filename: path.basename(imagePath),
      created: new Date().toISOString(),
      expires: expiration.toISOString(),
      accessCount: 0
    };

    // Đảm bảo thư mục chứa file links.json tồn tại
    const linksDir = path.dirname(linksFile);
    if (!fs.existsSync(linksDir)) {
      fs.mkdirSync(linksDir, { recursive: true });
    }

    // Đọc file links.json hiện có hoặc tạo mới nếu không tồn tại
    let links = {};
    if (fs.existsSync(linksFile)) {
      const linksData = fs.readFileSync(linksFile, 'utf8');
      links = JSON.parse(linksData);
    }

    // Thêm liên kết mới
    links[linkId] = linkInfo;

    // Lưu lại file links.json
    fs.writeFileSync(linksFile, JSON.stringify(links, null, 2));

    // Tạo URL liên kết
    const linkUrl = `${baseUrl}/image/${linkId}`;

    return {
      id: linkId,
      url: linkUrl,
      expires: linkInfo.expires,
      filename: linkInfo.filename
    };
  } catch (error) {
    console.error('Lỗi khi tạo liên kết ảnh:', error);
    throw error;
  }
}

/**
 * Lấy thông tin về một liên kết ảnh
 * @param {string} linkId ID của liên kết
 * @param {string} linksFile Đường dẫn đến file lưu trữ các liên kết
 * @returns {Promise<object|null>} Thông tin về liên kết hoặc null nếu không tìm thấy
 */
async function getImageLink(linkId, linksFile = path.join(__dirname, '../data/links.json')) {
  try {
    // Kiểm tra file links.json tồn tại
    if (!fs.existsSync(linksFile)) {
      return null;
    }

    // Đọc file links.json
    const linksData = fs.readFileSync(linksFile, 'utf8');
    const links = JSON.parse(linksData);

    // Kiểm tra liên kết tồn tại
    if (!links[linkId]) {
      return null;
    }

    // Kiểm tra liên kết đã hết hạn hay chưa
    const linkInfo = links[linkId];
    const now = new Date();
    const expirationDate = new Date(linkInfo.expires);

    if (now > expirationDate) {
      return { expired: true, ...linkInfo };
    }

    // Tăng số lần truy cập
    linkInfo.accessCount++;
    
    // Lưu lại file links.json
    fs.writeFileSync(linksFile, JSON.stringify(links, null, 2));

    return linkInfo;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin liên kết ảnh:', error);
    throw error;
  }
}

module.exports = {
  createImageLink,
  getImageLink
};