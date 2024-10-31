import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/commons/shared/users/users.service';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > users')
@Controller('admin')
export class AdminUsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('users')
  @ApiOperation({ summary: '[완료] (도매처 or 셀러) 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  @ApiQuery({ name: 'query', required: false, description: '도매처명 or 셀러명' })
  async findAllOrder(
    @Query('type') type: string,
    @Query('query') query: string, 
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.usersService.findAllWholesalerWithPagination(query, paginationQueryDto);
    } else if (type === 'SELLER') {
      result = await this.usersService.findAllSellerWithPagination(query, paginationQueryDto);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }
  
  @Get('user/:userId')
  @ApiOperation({ summary: '[완료] (도매처 or 셀러) 개별 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'WHOLESALER or SELLER' })
  async findOneOrder(
    @Param('userId') userId: number, 
    @Query('type') type: string
  ) {
    let result;
    if (type === 'WHOLESALER') {
      result = await this.usersService.findOneWholesaler(userId);
    } else if (type === 'SELLER') {
      result = await this.usersService.findOneSeller(userId);
    }
    
    return {
      statusCode: 200,
      data: result
    };
  }
  /*
  @Get('users/wholesalers')
  @ApiOperation({ summary: '[완료] 도매처 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '도매처명' })
  async findAllWholesaler(
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto, 
  ) {
    const result = await this.usersService.findAllWholesalerWithPagination(query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }
  */
 /*
  @Get('users/wholesaler/:wholesalerId')
  @ApiOperation({ summary: '[완료] 도매처 개별 조회' })
  @ApiResponse({ status: 200 })
  async findOneWholesaler(
    @Param('wholesalerId') wholesalerId: number, 
  ) {
    const result = await this.usersService.findOneWholesaler(wholesalerId);
    return {
      statusCode: 200,
      data: result
    };
  }
  */
  /*
  @Get('users/sellers')
  @ApiOperation({ summary: '[완료] 셀러 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'query', required: false, description: '셀러명' })
  async findAllSeller(
    @Query('query') query: string,
    @Query() paginationQueryDto: PaginationQueryDto, 
  ) {
    const result = await this.usersService.findAllSellerWithPagination(query, paginationQueryDto);
    return {
      statusCode: 200,
      data: result
    };
  }
  */
 /*
  @Get('users/seller/:sellerId')
  @ApiOperation({ summary: '[완료] 셀러 개별 조회' })
  @ApiResponse({ status: 200 })
  async findOneSeller(
    @Param('sellerId') sellerId: number, 
  ) {
    const result = await this.usersService.findOneSeller(sellerId);
    return {
      statusCode: 200,
      data: result
    };
  }
  */
}
