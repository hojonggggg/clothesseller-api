import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { ImageUploadService } from 'src/commons/shared/image-upload/image-upload.service';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';

@ApiTags('admin > images')
@Controller('images')
export class ImageUploadController {
  constructor(
    private readonly imageUploadService: ImageUploadService
  ) {}
  /*
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', this.imageUploadService.getMulterOptions()))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // 업로드된 파일의 URL을 반환
    return {
      url: `/uploads/${file.filename}`,
    };
  }
  */

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage(), // 메모리 스토리지 사용
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '이미지 등록' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    description: '이미지 파일 업로드',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async imageUpload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.imageUploadService.imageUpload(file);
    return {
      statusCode: 200,
      message: '이미지 등록이 완료되었습니다.',
      data: result
    };
  }

}
