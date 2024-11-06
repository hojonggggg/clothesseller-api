import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AdminBoardsController } from './boards.controller';
import { BoardsService } from 'src/commons/shared/boards/boards.service';
import { Board } from 'src/commons/shared/boards/entities/board.entity';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board
    ]),
    MulterModule.register({
      storage: memoryStorage()
    }),
  ],
  providers: [BoardsService],
  controllers: [AdminBoardsController]
})
export class AdminBoardsModule {}
