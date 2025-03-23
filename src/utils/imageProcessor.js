const { createFilter, createPipeline, withPerformanceTracking } = require('../utils/pipeAndFilter');
const { convertToPng } = require('../filter/convertToPNG');
const { createImageLink, getImageLink } = require('../filter/pngToLink');
const { generateQRCode } = require('../filter/linkToQR');

// Filter 1: Chuyển đổi ảnh sang PNG
const pngConverterFilter = createFilter('pngConverter', async (inputData) => {
  const { imagePath, outputPath } = inputData;
  const pngPath = await convertToPng(imagePath, outputPath);
  return { ...inputData, pngPath };
});

// Filter 2: Tạo liên kết chia sẻ
const createLinkFilter = createFilter('createLink', async (inputData) => {
  const { pngPath, baseUrl, expirationDays } = inputData;
  const linkInfo = await createImageLink(pngPath, {
    baseUrl: baseUrl || 'http://localhost:3000',
    expirationDays: expirationDays || 7
  });
  return { ...inputData, linkInfo };
});

// Filter 3: Tạo mã QR
const generateQRFilter = createFilter('generateQR', async (inputData) => {
  const { linkInfo, qrOutputDir, qrFilename } = inputData;
  const imageUrl = inputData.imageUrl || `${inputData.baseUrl}/image/${linkInfo.id}`;
  const qrPath = await generateQRCode(imageUrl, {
    outputDir: qrOutputDir || './qrcodes',
    filename: qrFilename || `qr-${linkInfo.id}.png`
  });
  return { ...inputData, qrPath, imageUrl };
});

// Tạo pipeline thống nhất xử lý toàn bộ quy trình
const imagePipeline = createPipeline(
  withPerformanceTracking('pngConverter', pngConverterFilter),
  withPerformanceTracking('createLink', createLinkFilter),
  withPerformanceTracking('generateQR', generateQRFilter)
);

module.exports = {
  imagePipeline,
  pngConverterFilter,
  createLinkFilter,
  generateQRFilter,
};