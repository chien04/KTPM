const express = require('express');
const router = express.Router();

// Route để xem thông tin về liên kết
router.get('/:linkId/info', async function (req, res) {
  try {
    const linkId = req.params.linkId;
    
    
    // Tạo đường dẫn liên kết ảnh
    const imageLink = `${req.protocol}://${req.get('host')}/image/${linkId}`;
    
    // Truyền thêm biến imageLink vào template
    res.render('link-info', { 
      imageLink: imageLink
    });
  } catch (error) {
    console.error('Lỗi khi xử lý thông tin liên kết:', error);
    res.status(500).render('error', { message: 'Đã xảy ra lỗi khi xử lý thông tin liên kết' });
  }
});

module.exports = router;