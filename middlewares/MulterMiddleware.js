const multer = require("multer");
const storage = multer.diskStorage({});

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpg|jpeg|png|gif$i/)) {
      cb(new Error("File is not supported"), false);
      return;
    }

    cb(null, true);
  },
});
