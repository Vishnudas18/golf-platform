const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result.secure_url;
};

module.exports = { uploadToCloudinary };
