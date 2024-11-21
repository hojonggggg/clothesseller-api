import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository} from 'typeorm';
import { WeekProduct } from './entities/week-product.entity';
import { CreateWeekProductDto } from './dto/create-week-product.dto';
import { SetWeekProductDto } from './dto/set-week-product.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class WeekProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WeekProduct)
    private weekProductRepository: Repository<WeekProduct>,
  ) {}

  async createWeekProduct(createWeekProductDto: CreateWeekProductDto, file: Express.Multer.File) {
    let thumbnailPath = null;

    if (file) {
      try {
        const uploadDir = 'uploads/weekProducts';

        await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;

        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, file.buffer);

        thumbnailPath = `/weekProducts/${fileName}`;
        createWeekProductDto.thumbnailImage = thumbnailPath; 
      } catch (error) {
        console.error('File upload error:', error);
        throw new BadRequestException('파일 업로드에 실패했습니다.');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const weekProduct = this.weekProductRepository.create({
        ...createWeekProductDto
      });

      return await this.weekProductRepository.save(weekProduct);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  /*
  async setWeekProduct(setWeekProductDto: SetWeekProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.weekProductRepository.clear();

      const { products } = setWeekProductDto;
      for (const product of products) {
        this.weekProductRepository.save(product);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  */
  async findAllWeekProduct() {
    const queryBuilder = this.weekProductRepository.createQueryBuilder('weekProduct')
      .leftJoinAndSelect('weekProduct.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.options', 'options')
      .leftJoinAndSelect('wholesalerProduct.wholesalerProfile', 'wholesalerProfile');

    const weekProducts = await queryBuilder
      .orderBy('weekProduct.seq', 'ASC')
      .getMany();
    
    for (const weekProduct of weekProducts) {
      const colors = [];
      const sizes = [];
      const { wholesalerProduct } = weekProduct;
      const { options, wholesalerProfile } = wholesalerProduct;
      for (const option of options) {
        const { color, size } = option;
        if (!colors.includes(color)) {
          colors.push(color);
        }
        //sizes.push(size);
      }
      weekProduct.name = wholesalerProduct.name;
      weekProduct.price = formatCurrency(wholesalerProduct.price);
      weekProduct.colors = colors;
      //eekProduct.sizes = sizes;
      weekProduct.wholesalerName = wholesalerProfile.name;

      delete(weekProduct.id);
      delete(weekProduct.wholesalerProduct);
    }
    
    return weekProducts;
  }

}
