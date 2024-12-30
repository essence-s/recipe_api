import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary';
// import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: 'dc05tenjs',
  api_key: '528321319335944',
  api_secret: process.env.API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const data = [
  {
    folderName: 'large',
    width: 1200,
  },
  {
    folderName: 'medium',
    width: 800,
  },
  {
    folderName: 'small',
    width: 200,
  },
];
@Injectable()
export class UploadImageService {
  async createThumbnails(file) {
    try {
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
    } catch (error) {
      throw new HttpException(
        { message: 'error create Thumbnails' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteThumbnails(publicId) {
    try {
      // const promises = data.map(async (item) => {
      //   const result = await cloudinary.uploader.destroy(
      //     `thumbnails/${item.folderName}/${publicId}`,
      //   );
      //   // console.log('Imagen eliminada:', result);
      //   return result;
      // });

      const result2 = await cloudinary.api.delete_resources(
        data.map((item) => `thumbnails/${item.folderName}/${publicId}`),
      );
      // console.log(result2);
      return result2;
      // return await Promise.all(promises);
    } catch (error) {
      console.error('Error eliminando la imagen:', error);
      throw new HttpException(
        {
          message: 'error delete Thumbnails',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateThumbnails(imageID, imageBuffer) {
    // eliminamos la imagen anterior
    await this.deleteThumbnails(imageID);

    // creamos las miniaturas
    const resultData = await this.createThumbnails(imageBuffer);

    return resultData;
  }
}
