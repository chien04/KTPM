const express = require('express');
const router = express.Router();

// Route hiển thị trang chủ
router.get('/', function (req, res) {
  res.render('home');
});

module.exports = router;