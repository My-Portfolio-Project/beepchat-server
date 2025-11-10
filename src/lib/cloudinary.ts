
// src/lib/cloudinary.ts
const { v2: cloudinary } = require('cloudinary');
import dotenv from 'dotenv'

dotenv.config();

const configureCloudinary = () => {
  const CLOUD_NAME = process.env.CLOUD_NAME;
  const CLOUD_KEY = process.env.CLOUD_KEY;
  const CLOUD_SEC = process.env.CLOUD_SEC;

  if (!CLOUD_NAME || !CLOUD_KEY || !CLOUD_SEC) {
    throw new Error('Please provide all Cloudinary credentials');
  }

  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_KEY,
    api_secret: CLOUD_SEC,
  });

  return cloudinary;
};

module.exports = configureCloudinary;
