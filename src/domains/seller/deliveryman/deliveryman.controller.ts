import { Body, ConflictException, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { DeliverymanService } from './deliveryman.service';
import { Deliveryman } from './entities/deliveryman.entity';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';

@ApiTags('seller > deliveryman')
@Controller('seller/deliveryman')
export class DeliverymanController {
  constructor(
    private readonly deliverymanService: DeliverymanService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '사입삼촌 등록' })
  @ApiResponse({ status: 201, type: Deliveryman })
  async createDeliveryman(
    @Body() createDeliverymanDto: CreateDeliverymanDto, 
    @Request() req
  ) {
    const sellerId = req.user.uid;
    const { mobile } = createDeliverymanDto;
    console.log({sellerId, mobile});
    const deliveryman = await this.deliverymanService.findOneDeliverymanBySellerIdAndMobile(sellerId, mobile);
    if (deliveryman) {
      throw new ConflictException('이미 등록된 사입삼촌입니다.');
    }
    return await this.deliverymanService.createDeliveryman(sellerId, createDeliverymanDto);
  }
}
