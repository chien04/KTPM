const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');

// Tạo app Express
const app = express();

// Cấu hình handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/converted', express.static(path.join(__dirname, 'converted')));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// Đảm bảo các thư mục cần thiết tồn tại
const dirs = ['uploads', 'converted', 'qrcodes'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Import các routes
const indexRoutes = require('./routes/index');
const convertRoutes = require('./routes/convert');
const imageRoutes = require('./routes/image');
const linkRoutes = require('./routes/link');
const qrRoutes = require('./routes/qr');

// Sử dụng routes
app.use('/', indexRoutes);
app.use('/convert', convertRoutes);
app.use('/image', imageRoutes);
app.use('/link', linkRoutes);
app.use('/qr', qrRoutes);

// Middleware xử lý lỗi 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Trang không tồn tại' });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Đã xảy ra lỗi' });
});

module.exports = app;