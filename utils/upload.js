const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require("path");

// Storage configuration for customer uploads
const customerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/customers"));
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, `IMG-${Date.now()}` + ext);
  },
});

// Storage configuration for pet uploads
const petStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/pets"));
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, `IMG-${Date.now()}${ext}`);
  },
});

// File filter for image uploads
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("File format not supported"), false);
  }
  cb(null, true);
};

// Multer configuration for customer uploads
const customerupload = multer({
  storage: customerStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxSize },
}).single("profilePicture");

// Multer configuration for pet uploads
const petupload = multer({
  storage: petStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxSize },
}).single("image");

module.exports = { customerupload, petupload };
