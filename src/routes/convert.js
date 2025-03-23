const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const upload = require('../config/multer');
const { imagePipeline } = require('../utils/imageProcessor');

// Route để xử lý việc upload, chuyển đổi ảnh và tạo link và QR
router.post('/', upload.single('image'), async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).send('Không có file nào được upload');
    }

    const inputPath = req.file.path;
    const outputDir = path.join(__dirname, '..', 'converted');
    const qrDir = path.join(__dirname, '..', 'qrcodes');
    
    // Đảm bảo thư mục đầu ra tồn tại
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Đảm bảo thư mục QR tồn tại
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${Date.now()}.png`);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Sử dụng pipeline thống nhất để xử lý ảnh, tạo link và QR
    const result = await imagePipeline({
      imagePath: inputPath,
      outputPath: outputPath,
      baseUrl: baseUrl,
      expirationDays: 7,
      qrOutputDir: qrDir
    });
    
    // Trả về đường dẫn tương đối của file đã chuyển đổi
    const relativePath = '/converted/' + path.basename(result.pngPath);
    const qrPath = '/qrcodes/' + path.basename(result.qrPath);
    
    // Tính tổng thời gian xử lý
    const totalTime = (
      result.performance?.pngConverter || 0) + 
      (result.performance?.createLink || 0) + 
      (result.performance?.generateQR || 0
    );
    
    res.render('result', { 
      originalImage: '/uploads/' + path.basename(inputPath),
      convertedImage: relativePath,
      qrCodePath: qrPath,
      expirationDate: new Date(result.linkInfo.expires).toLocaleDateString(),
      linkId: result.linkInfo.id,
      imageUrl: result.imageUrl,

      pngConverterTime: result.performance?.pngConverter?.toFixed(2) || "N/A",
      createLinkTime: result.performance?.createLink?.toFixed(2) || "N/A",
      generateQRTime: result.performance?.generateQR?.toFixed(2) || "N/A",
      totalProcessingTime: totalTime.toFixed(2)
    });

  } catch (error) {
    console.error('Lỗi khi xử lý ảnh:', error);
    res.status(500).render('error', { message: 'Đã xảy ra lỗi khi xử lý ảnh' });
  }
});

module.exports = router;