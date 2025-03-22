const express = require('express');
const fs = require('fs');
const router = express.Router();

// Import các module cần thiết
const { getLinkInfoFilter } = require('../utils/imageProcessor');

// Route để truy cập ảnh thông qua link
router.get('/:linkId', async function (req, res) {
  try {
    const linkId = req.params.linkId;
    
    // Sử dụng filter đơn lẻ thay vì pipeline
    const result = await getLinkInfoFilter({ linkId });
    
    if (!result.linkInfo) {
      return res.status(404).render('error', { message: 'Liên kết không tồn tại' });
    }
    
    if (result.linkInfo.expired) {
      return res.status(410).render('error', { message: 'Liên kết đã hết hạn' });
    }
    
    if (!fs.existsSync(result.linkInfo.originalPath)) {
      return res.status(404).render('error', { message: 'File ảnh không còn tồn tại' });
    }
    
    // Gửi file ảnh
    res.sendFile(result.linkInfo.originalPath);
  } catch (error) {
    console.error('Lỗi khi xử lý liên kết ảnh:', error);
    res.status(500).render('error', { message: 'Đã xảy ra lỗi khi xử lý liên kết ảnh' });
  }
});

module.exports = router;