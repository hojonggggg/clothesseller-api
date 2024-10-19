import { Controller, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';

@ApiTags('wholesaler > product-requests')
@Controller('wholesaler')
export class ProductRequestsController {
  constructor(
    private productRequestsService: ProductRequestsService
  ) {}

  @Patch('product-request/:productRequestId/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[개발중] 상품 등록 요청 승인' })
  @ApiResponse({ status: 200 })
  async approveProductRequest(
    @Param('productRequestId') productRequestId: number,
    @Request() req
  ) {
    const wholesalerId = req.user.uid;
    //await this.productRequestsService.approveProductRequest(wholesalerId, productRequestId);
    return {
      statusCode: 200,
      message: '상품 등록 요청이 완료되었습니다.'
    };
  }

}
