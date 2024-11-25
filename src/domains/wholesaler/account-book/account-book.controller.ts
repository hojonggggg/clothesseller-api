import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { AccountBookService } from 'src/commons/shared/account-book/account-book.service';
import { CreateAccountBookDto } from 'src/commons/shared/account-book/dto/create-account-book.dto';
import { UpdateAccountBookDto } from 'src/commons/shared/account-book/dto/update-account-book.dto';

@ApiTags('wholesaler > account-book')
@Controller('wholesaler')
export class WholesalerAccountBookController {
  constructor(
    private accountBookService: AccountBookService,
  ) {}

  @Get('account-book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '월별 장부 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'month', required: true, description: '조회하려는 달' })
  @ApiQuery({ name: 'query', required: false, description: '셀러명' })
  async findAllAccountBookOfMonthly(
    @Request() req,
    @Query('month') month: string,
    @Query('query') query: string,
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.accountBookService.findAllAccountBookOfMonthly(wholesalerId, month, query);
    return {
      statusCode: 200,
      list: result.list,
      sellers: result.sellers
    };
  }

  @Post('account-book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '장부 등록' })
  @ApiResponse({ status: 201 })
  async createAccountBook(
    @Request() req,
    @Body() createAccountBookDto: CreateAccountBookDto,
  ) {
    const wholesalerId = req.user.uid;
    await this.accountBookService.createAccountBook(wholesalerId, createAccountBookDto);
    return {
      statusCode: 201,
      message: '장부 등록이 완료되었습니다.'
    };
  }
  
  
  @Patch('account-book/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '장부 수정' })
  @ApiResponse({ status: 200 })
  async updateAccountBookById(
    @Request() req,
    @Param('id') id: number, 
    @Body() updateAccountBookDto: UpdateAccountBookDto,
  ) {
    const wholesalerId = req.user.uid;
    const result = await this.accountBookService.updateAccountBookById(id, wholesalerId, updateAccountBookDto);
    return {
      statusCode: 200,
      message: '장부 수정이 완료되었습니다.'
    };
  }
}
