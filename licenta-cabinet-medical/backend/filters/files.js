const multer = require('multer');

const MIME_TYPE_MAP = {
  'application/pdf': 'pdf'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }

    cb(error, "backend/pdfFiles");
  },
  filename: (req, file, cb) => {
    // console.log(file.id);
    const name = file.originalname.toLowerCase().split(" ").join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extension);
  }
})


module.exports = multer({storage: storage}).single("pdf");
