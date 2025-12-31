const PDFMerger = require('pdf-merger-js').default;
const path = require('path');

const mergePdfs = async (pdfPaths) => {
  const merger = new PDFMerger();

  for (const pdfPath of pdfPaths) {
    await merger.add(pdfPath);
  }

  const outputPath = path.join(__dirname, 'public', 'merged.pdf');
  await merger.save(outputPath);
};

module.exports = { mergePdfs };
