import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository} from 'typeorm';
import { WeekProduct } from './entities/week-product.entity';
import { SetWeekProductDto } from './dto/set-week-product.dto';
import { formatCurrency } from 'src/commons/shared/functions/format-currency';

@Injectable()
export class WeekProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(WeekProduct)
    private weekProductRepository: Repository<WeekProduct>,
  ) {}

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

  async findAllWeekProduct() {
    const queryBuilder = this.weekProductRepository.createQueryBuilder('weekProduct')
      .leftJoinAndSelect('weekProduct.wholesalerProduct', 'wholesalerProduct')
      .leftJoinAndSelect('wholesalerProduct.options', 'options');

    const weekProducts = await queryBuilder
      .orderBy('weekProduct.seq', 'ASC')
      .getMany();
    
    for (const weekProduct of weekProducts) {
      const colors = [];
      const sizes = [];
      const { wholesalerProduct } = weekProduct;
      const { options } = wholesalerProduct;
      for (const option of options) {
        const { color, size } = option;
        colors.push(color);
        sizes.push(size);
      }
      weekProduct.name = wholesalerProduct.name;
      weekProduct.price = formatCurrency(wholesalerProduct.price);
      weekProduct.colors = colors;
      weekProduct.sizes = sizes;

      delete(weekProduct.id);
      delete(weekProduct.wholesalerProduct);
    }
    
    return weekProducts;
  }

}
