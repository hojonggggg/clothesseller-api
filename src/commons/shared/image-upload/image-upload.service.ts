import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
//import { diskStorage } from 'multer';
//import { extname } from 'path';

@Injectable()
export class ImageUploadService {

  async imageUpload(category: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    try {
      //const uploadDir = 'uploads/images';
      let uploadDir;
      if (category === 'board') {
        uploadDir = 'uploads/images/board'
      } else if (category === 'product') {
        uploadDir = 'uploads/images/product'
      }

      await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;

      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      const imagePath = `${uploadDir}/${fileName}`;
      return imagePath;
    } catch (error) {
      console.error('File upload error:', error);
      throw new BadRequestException('파일 업로드에 실패했습니다.');
    }
  }
  /*
  // Multer 옵션 설정
  getMulterOptions() {
    return {
      storage: diskStorage({
        destination: './uploads', // 업로드된 파일의 저장 위치
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix); // 고유한 파일 이름 생성
        },
      }),
    };
  }
  */
}
