import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { BoardsService } from 'src/commons/shared/boards/boards.service';
import { CreateBoardDto } from 'src/commons/shared/boards/dto/create-board.dto';
import { UpdateBoardDto } from 'src/commons/shared/boards/dto/update-board.dto';
import { PaginationQueryDto } from 'src/commons/shared/dto/pagination-query.dto';

@ApiTags('admin > boards')
@Controller('admin')
export class AdminBoardsController {
  constructor(
    private boardsService: BoardsService
  ) {}

  @Post('board')
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
  @ApiOperation({ summary: '[완료] 게시글 등록' })
  @ApiResponse({ status: 201 })
  @ApiBody({
    description: '게시글 등록',
    type: CreateBoardDto,
  })
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    //@UploadedFile() file: Express.Multer.File,
  ) {
    //await this.boardsService.createBoard(createBoardDto, file);
    await this.boardsService.createBoard(createBoardDto);
    return {
      statusCode: 201,
      message: '게시글 등록이 완료되었습니다.'
    };
  }

  @Get('boards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 게시글 목록 조회' })
  @ApiResponse({ status: 200 })
  @ApiQuery({ name: 'type', required: true, description: 'COMMON or WHOLESALER or SELLER' })
  async findAllBoard(
    @Query('type') type: string,
    @Query() paginationQueryDto: PaginationQueryDto
  ) {
    return this.boardsService.findAllBoard(type, paginationQueryDto);
  }

  @Get('board/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 게시글 상세 조회' })
  @ApiResponse({ status: 200 })
  async findOneBoard(@Param('id') id: number) {
    const result = await this.boardsService.findOneBoard(id);
    return {
      statusCode: 200,
      data: result
    };
  }

  @Patch('board/:id')
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
  @ApiOperation({ summary: '[완료] 게시글 수정' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    description: '게시글 수정',
    type: UpdateBoardDto,
  })
  async updateBoard(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    //@UploadedFile() file: Express.Multer.File,
  ) {
    //await this.boardsService.updateBoard(id, updateBoardDto, file);
    await this.boardsService.updateBoard(id, updateBoardDto);
    return {
      statusCode: 200,
      message: '게시글 수정이 완료되었습니다.'
    };
  }

  @Delete('board/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[완료] 게시글 삭제' })
  @ApiResponse({ status: 200 })
  async deleteBoard(@Param('id') id: number) {
    await this.boardsService.deleteBoard(id);
    return {
      statusCode: 200,
      message: '게시글 삭제가 완료되었습니다.'
    };
  }


}
