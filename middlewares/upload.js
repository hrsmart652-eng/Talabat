const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    let folder = "uploads";

    if (file.fieldname === "avatar") {
      folder = "uploads/avatars";
    } 
    
    else if (file.fieldname === "category_image") {
      folder = "uploads/categories";
    } 
    
    else if (file.fieldname === "meal_image") {
      folder = "uploads/meals";
    } 
    
    else if (file.fieldname === "logo") {
      folder = "uploads/restaurants/logos";
    } 
    
    else if (file.fieldname === "cover_image") {
      folder = "uploads/restaurants/covers";
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;