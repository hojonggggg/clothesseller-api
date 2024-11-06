import * as fs from 'fs/promises';
import * as path from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from 'src/commons/shared/boards/dto/update-board.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async createBoard(createBoardDto: CreateBoardDto, file: Express.Multer.File) {
    let thumbnailPath = null;

    if (file) {
      try {
        const uploadDir = 'uploads/thumbnails';

        await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;

        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, file.buffer);

        thumbnailPath = `/thumbnails/${fileName}`;
        createBoardDto.thumbnailImage = thumbnailPath; 
      } catch (error) {
        console.error('File upload error:', error);
        throw new BadRequestException('파일 업로드에 실패했습니다.');
      }
    }

    try {
      const board = this.boardRepository.create({
        ...createBoardDto,
      });

      return await this.boardRepository.save(board);
    } catch (error) {
      // 파일이 저장되었다면 삭제
      if (thumbnailPath) {
        const filePath = path.join('uploads', thumbnailPath);
        await fs.unlink(filePath).catch(() => {});
      }
      throw error;
    }
  }

  async findAllBoard(type: string, paginationQueryDto: PaginationQueryDto) {
    const { pageNumber, pageSize } = paginationQueryDto;

    const queryBuilder = this.boardRepository.createQueryBuilder('board')
      .where('board.type = :type', { type })
      .andWhere('board.isDeleted = false');

    const [boards, total] = await queryBuilder
      .orderBy('board.id', 'DESC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    
    for (const board of boards) {
      delete(board.isDeleted);
    }
    
    return {
      list: boards,
      total,
      page: Number(pageNumber),
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOneBoard(id: number) {
    const board = await this.boardRepository.findOne({
      where: { id },
    });

    delete(board.isDeleted);

    return board;
  }

  async updateBoard(id: number, updateBoardDto: UpdateBoardDto, file: Express.Multer.File) {
    const board = await this.boardRepository.findOne({
      where: { id }
    });
    let thumbnailPath = board.thumbnailImage;

    if (file) {
      try {
        const uploadDir = 'uploads/thumbnails';

        await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;

        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, file.buffer);

        thumbnailPath = `/thumbnails/${fileName}`;
        updateBoardDto.thumbnailImage = thumbnailPath; 
      } catch (error) {
        console.error('File upload error:', error);
        throw new BadRequestException('파일 업로드에 실패했습니다.');
      }
    }

    try {
      const board = await this.boardRepository.update(
        {
          id
        }, {
          ...updateBoardDto,
        }
      );

      const oldFilePath = path.join('uploads', thumbnailPath);
      await fs.unlink(oldFilePath).catch(() => {});
    } catch (error) {
      // 파일이 저장되었다면 삭제
      if (thumbnailPath) {
        const filePath = path.join('uploads', thumbnailPath);
        await fs.unlink(filePath).catch(() => {});
      }
      throw error;
    }
  }

  async deleteBoard(id: number) {
    await this.boardRepository.update(
      {
        id
      }, {
        isDeleted: true
      }
    );
  }

}
