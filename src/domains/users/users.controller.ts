import { Body, ConflictException, Controller, ForbiddenException, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from 'src/commons/shared/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Deliveryman } from './entities/deliveryman.entity';
import { Role } from './enums/role.enum';
import { CreateDeliverymanDto } from './dto/create-deliveryman.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('deliveryman')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[셀러] 사입삼촌 등록' })
  @ApiResponse({ status: 201, type: Deliveryman })
  async createDeliveryman(
    @Body() createDeliverymanDto: CreateDeliverymanDto, 
    @Request() req
  ) {
    console.log("deleveryman");
    const sellerId = req.user.uid;
    const { mobile } = createDeliverymanDto;
    console.log({sellerId, mobile});
    const deliveryman = await this.usersService.findOneDeliverymanBySellerIdAndMobile(sellerId, mobile);
    if (deliveryman) {
      throw new ConflictException('이미 등록된 사입삼촌입니다.');
    }
    return await this.usersService.createDeliveryman(sellerId, createDeliverymanDto);
  }



  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[관리자] 권한별 전체 사용자 조회' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiQuery({ name: 'role', enum: Role })
  async findAllUsers(
    @Query('role') role: Role, 
    @Query() paginationQuery: PaginationQueryDto, 
    @Request() req
  ) {
    const userRole = req.user.role;
    console.log({userRole});
    if (userRole === 'SELLER') {
      throw new ForbiddenException('셀러는 권한이 없습니다.');
    }
    return await this.usersService.findAllUsers(role, paginationQuery);
  }


}
