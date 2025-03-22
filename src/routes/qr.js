const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Route để tạo mã QR từ link
router.get('/link/:linkId', async function (req, res) {
  try {
    const linkId = req.params.linkId;
    const qrDir = path.join(__dirname, '..', 'qrcodes');
    
    // Đảm bảo thư mục qrcodes tồn tại
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    
    // Tạo URL đầy đủ của hình ảnh
    const imageUrl = `${req.protocol}://${req.get('host')}/image/${linkId}`;
    
    // Trả về trang hiển thị mã QR
    res.render('qr-code', { 
      imageUrl: imageUrl,
      // qrCodePath: '/qrcodes/' + path.basename(result.qrPath),
    });
  } catch (error) {
    console.error('Lỗi khi tạo mã QR:', error);
    res.status(500).render('error', { message: 'Đã xảy ra lỗi khi tạo mã QR' });
  }
});

module.exports = router;