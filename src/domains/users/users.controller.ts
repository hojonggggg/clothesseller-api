import { Body, ConflictException, Controller, ForbiddenException, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiResponse({ status: 201, type: User })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneUserById(createUserDto.id);
    if (user) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '권한별 전체 사용자 조회' })
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
    return this.usersService.findAllUsers(role, paginationQuery);
  }


}
