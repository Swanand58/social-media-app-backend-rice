const multer = require("multer");
const stream = require("stream");
const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_URL } = require("../constants/constants");
const dotenv = require("dotenv");

if (!process.env.CLOUDINARY_URL) {
  console.log("Problem in cloudinary environment");
}

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const s = new stream.PassThrough();
    s.end(fileBuffer);
    s.pipe(uploadStream);
    s.on("end", uploadStream.end);
  });
};
module.exports = { uploadToCloudinary };
