const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === "logo") {
      cb(null, "uploads/restaurants/logos");
    } 
    else if (file.fieldname === "cover_image") {
      cb(null, "uploads/restaurants/covers");
    } 
    else {
      cb(null, "uploads/restaurants");
    }

  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadRestaurant = multer({ storage });

module.exports = uploadRestaurant;