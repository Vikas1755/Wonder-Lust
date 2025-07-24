const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'WonderLust',
    allowedFormats : ["png","jpg","jpeg"]
  },
});

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted:", result);
  } catch (err) {
    console.error("Error deleting image:", err);
  }
};


module.exports = {
    cloudinary,
    storage,
    deleteImage
}