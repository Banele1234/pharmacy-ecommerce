import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../../lib/cloudinary/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ message: 'Public ID is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: error.message });
  }
}