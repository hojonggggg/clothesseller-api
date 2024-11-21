import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { WeekProductsService } from 'src/commons/shared/week-products/week-products.service';
import { CreateWeekProductDto } from 'src/commons/shared/week-products/dto/create-week-product.dto';
import { SetWeekProductDto } from 'src/commons/shared/week-products/dto/set-week-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('admin > week-products')
@Controller('admin')
export class AdminWeekProductsController {
  constructor(
    private readonly weekProductsService: WeekProductsService
  ) {}

  @Post('week-product')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  /*
  @UseInterceptors(FileInterceptor('thumbnailImage', {
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
  */
  @ApiOperation({ summary: '[완료] 금주의 상품 등록' })
  @ApiResponse({ status: 200 })
  async setWeekProduct(
    @Body() setWeekProductDto: SetWeekProductDto,
    //@UploadedFile() file: Express.Multer.File,
  ) {
    //await this.weekProductsService.createWeekProduct(createWeekProductDto, file);
    await this.weekProductsService.setWeekProduct(setWeekProductDto);
    return {
      statusCode: 200,
      message: '금주의 상품 등록이 완료되었습니다.'
    };
  }

  @Get('week-products')
  @ApiOperation({ summary: '[완료] 금주의 상품 목록 조회' })
  @ApiResponse({ status: 200 })
  async findAllWeekProduct() {
    const result = await this.weekProductsService.findAllWeekProduct();

    return {
      statusCode: 200,
      data: result,
    }
  }

}
