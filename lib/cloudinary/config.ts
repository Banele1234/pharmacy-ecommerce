import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME='dl54rthoj',
  api_key: process.env.CLOUDINARY_API_KEY='977722539341777',
  api_secret: process.env.CLOUDINARY_API_SECRET='1CA2aGeNVhng-jDziuQVUP66kyc',
});

export default cloudinary;