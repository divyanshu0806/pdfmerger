const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer  = require('multer');
const { mergePdfs } = require('./merge.js');

const app = express(); // Make sure this line exists
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use('/static', express.static('public'));
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/merge', upload.array('pdfs', 12), async (req, res, next) => {
  try {
    const tempPaths = [];

    // Write uploaded files to temp folder
    for (const file of req.files) {
      const tempPath = path.join(os.tmpdir(), file.originalname);
      fs.writeFileSync(tempPath, file.buffer);
      tempPaths.push(tempPath);
    }

    // Merge PDFs
    await mergePdfs(tempPaths);

    // Delete temp files
    tempPaths.forEach(p => fs.unlinkSync(p));

    res.redirect("/static/merged.pdf");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
