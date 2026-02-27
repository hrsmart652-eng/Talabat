const fs = require("fs");

function deleteFile(path) {
  if (!path) return;

  fs.unlink(path, (err) => {
    if (err) {
      console.log("file not found or already deleted");
    }
  });
}

module.exports = deleteFile;