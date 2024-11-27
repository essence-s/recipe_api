import { Injectable } from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary';
// import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: 'dc05tenjs',
  api_key: '528321319335944',
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

@Injectable()
export class UploadImageService {
  async createThumbnails(file) {
    const data = [
      {
        folderName: 'small',
        width: 200,
      },
      {
        folderName: 'medium',
        width: 800,
      },
      {
        folderName: 'large',
        width: 1200,
      },
    ];
    const name = uuidv4();
    const byteArrayBuffer = file;
    const promises = data.map(async (item) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: name,
              folder: `thumbnails/${item.folderName}`,
              transformation: [{ fetch_format: 'webp', width: item.width }],
            },
            (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result);
            },
          )
          .end(byteArrayBuffer);
      });
    });

    await Promise.all(promises);

    return {
      name,
    };
  }
}
