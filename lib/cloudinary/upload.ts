export interface UploadResult {
    url: string;
    public_id: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
  }
  
  export class CloudinaryService {
    // Upload file to Cloudinary (client-side)
    static async uploadFile(file: File): Promise<UploadResult> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        if (!response.ok) {
          throw new Error('Upload failed');
        }
  
        const data = await response.json();
        
        return {
          url: data.secure_url,
          public_id: data.public_id,
          format: data.format,
          bytes: data.bytes,
          width: data.width,
          height: data.height
        };
      } catch (error: any) {
        throw new Error(`Upload failed: ${error.message}`);
      }
    }
  
    // Delete file from Cloudinary (server-side)
    static async deleteFile(publicId: string): Promise<void> {
      try {
        const response = await fetch('/api/cloudinary/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicId }),
        });
  
        if (!response.ok) {
          throw new Error('Delete failed');
        }
      } catch (error: any) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    }
  
    // Upload multiple files
    static async uploadMultipleFiles(files: File[]): Promise<UploadResult[]> {
      const uploadPromises = files.map(file => this.uploadFile(file));
      return Promise.all(uploadPromises);
    }
  }