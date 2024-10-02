import { Body, ConflictException, Controller, ForbiddenException, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Deleveryman } from './entities/deleveryman.entity';
import { Role } from './enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDeleverymanDto } from './dto/create-deleveryman.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  /*
  @Post()
  @ApiOperation({ summary: '[테스트] 사용자 생성' })
  @ApiResponse({ status: 201, type: User })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneUserById(createUserDto.id);
    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }
    return await this.usersService.createUser(createUserDto);
  }
  */
  @Post('deleveryman')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[셀러] 사입삼촌 등록' })
  @ApiResponse({ status: 201, type: Deleveryman })
  async createDeleveryman(
    @Body() createDeleverymanDto: CreateDeleverymanDto, 
    @Request() req
  ) {
    console.log("deleveryman");
    const sellerId = req.user.uid;
    const { mobile } = createDeleverymanDto;
    console.log({sellerId, mobile});
    const deleveryman = await this.usersService.findOneDeleverymanBySellerIdAndMobile(sellerId, mobile);
    if (deleveryman) {
      throw new ConflictException('이미 등록된 사입삼촌입니다.');
    }
    return await this.usersService.createDeleveryman(sellerId, createDeleverymanDto);
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
