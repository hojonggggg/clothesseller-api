import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Between, Brackets, In } from 'typeorm';
import { AccountBook } from './entities/account-book.entity';
//import { WholesalerOrder } from '../orders/entities/wholesaler-order.entity';
import { getStartAndEndDate } from '../functions/date';
import { formatCurrency, formatHyphenDay } from '../functions/format';
import { CreateAccountBookDto } from './dto/create-account-book.dto';
import { UpdateAccountBookDto } from './dto/update-account-book.dto';

@Injectable()
export class AccountBookService {
  constructor(
    //@InjectRepository(WholesalerOrder)
    //private wholesalerOrderRepository: Repository<WholesalerOrder>,
    @InjectRepository(AccountBook)
    private accountBookRepository: Repository<AccountBook>,
  ) {}
  /*
  async findAllAccountBookOfMonthly(wholesalerId: number, month: string) {
    let { startDate, endDate } = getStartAndEndDate(month);
    //startDate = startDate.replaceAll('/', '-');
    //endDate = endDate.replaceAll('/', '-');
    console.log({startDate, endDate});

    const queryBilder = this.wholesalerOrderRepository.createQueryBuilder('wo')
      .select([
        'SUBSTRING(wo.createdAt, 1, 10) AS createdAt',
        'wo.sellerId AS sellerId',
        'sp.name AS sellerName',
        'SUM(wo.quantity * wp.price) AS price',
      ])
      .leftJoin('wo.wholesalerProduct', 'wp')
      .leftJoin('wo.sellerProfile', 'sp')
      .where('wo.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('wo.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('wo.seller_id, SUBSTRING(wo.createdAt, 1, 10)')
      .orderBy('sp.name, SUBSTRING(wo.createdAt, 1, 10)');

    const results = await queryBilder.getRawMany();
    
    const filledResults = [];
    const today = new Date(); // 현재 날짜
    const year = today.getFullYear(); // 현재 연도
    const _month = today.getMonth(); // 현재 월 (0부터 시작)
    const monthStart = new Date(year, _month, 1); // 이번 달 1일
    const monthEnd = new Date(year, _month + 1, 0); // 이번 달 마지막 날
    
    // 날짜 생성
    const datesInMonth = [];
    for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
      //const formattedDate = formatHyphenDay(new Date(d).toISOString().split('T')[0]);
      const formattedDate = formatHyphenDay(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
      datesInMonth.push(formattedDate);
    }

    // 데이터 처리
    datesInMonth.forEach(formattedDate => {
      // 해당 날짜에 해당하는 데이터 필터링
      const dailyData = results.filter(r => r.createdAt === formattedDate);
    
      // 셀러별 데이터 그룹화 및 price 계산
      const sellerData = {};
      dailyData.forEach(({ sellerId, sellerName, price }) => {
        console.log({sellerId, sellerName, price});
        if (!sellerData[sellerId]) {
          sellerData[sellerId] = { sellerName, price: 0 };
        }
        sellerData[sellerId].price += Number(price);
      });
    
      // 결과 저장
      filledResults.push({
        date: Number(formattedDate.slice(-2)),
        sellers: Object.keys(sellerData).map(sellerId => ({
          sellerId,
          sellerName: sellerData[sellerId].sellerName,
          price: formatCurrency(sellerData[sellerId].price),
        })),
      });
    });
    
    return filledResults;
  }
  */
  async findAllAccountBookOfMonthly(wholesalerId: number, month: string, query: string) {
    let { startDate, endDate } = getStartAndEndDate(month);

    const queryBuilder = this.accountBookRepository.createQueryBuilder('ab')
      .select([
        'ab.id AS id',
        'ab.date AS date',
        'ab.sellerId AS sellerId',
        'sp.name AS sellerName',
        'ab.price AS price',
      ])
      .leftJoin('ab.sellerProfile', 'sp')
      .where('ab.wholesalerId = :wholesalerId', { wholesalerId })
      .andWhere('ab.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('ab.date, ab.seller_id')
      .orderBy('ab.date, sp.name');

    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('sp.name LIKE :sellerName', { sellerName: `%${query}%` });
        })
      );
    }

    const results = await queryBuilder.getRawMany();

    const filledResults = [];
    const today = new Date();
    const year = today.getFullYear();
    const _month = today.getMonth();
    const monthStart = new Date(year, _month, 1);
    const monthEnd = new Date(year, _month + 1, 0);

    // 날짜 생성
    const datesInMonth = [];
    for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const formattedDate = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
      datesInMonth.push(formattedDate);
    }

    // 데이터 처리
    datesInMonth.forEach(formattedDate => {
      // 해당 날짜에 해당하는 데이터 필터링
      const dailyData = results.filter(r => r.date === formattedDate);
    
      // 셀러별 데이터 그룹화 및 price 계산
      const sellerData = {};
      dailyData.forEach(({ id, sellerId, sellerName, price }) => {
        if (!sellerData[sellerId]) {
          sellerData[sellerId] = { id, sellerName, price: 0 };
        }
        sellerData[sellerId].price += Number(price);
      });
    
      // 결과 저장
      filledResults.push({
        date: Number(formattedDate.slice(-2)),
        sellers: Object.keys(sellerData).map(sellerId => ({
          id: sellerData[sellerId].id,
          sellerId,
          sellerName: sellerData[sellerId].sellerName,
          price: formatCurrency(sellerData[sellerId].price),
        })),
      });
    });

    let sellerResults = results.reduce((acc, curr) => {
      const { sellerId, sellerName } = curr;
      if (!acc[sellerName]) {
        acc[sellerName] = [];
      }
      acc[sellerName].push({ sellerId });
      return acc;
    }, {});

    sellerResults = Object.entries(sellerResults)
      .sort(([sellerNameA], [sellerNameB]) => sellerNameA.localeCompare(sellerNameB))
      .map(([sellerName, data]) => ({
        sellerName,
        sellerId: data[0]['sellerId'],
        
      }));
    
    return { list: filledResults, sellers: sellerResults };
  }
  
  async createAccountBook(wholesalerId: number, createAccountBookDto: CreateAccountBookDto) {
    await this.accountBookRepository.save({
      wholesalerId,
      ...createAccountBookDto
    });
  }

  async updateAccountBookById(id: number, wholesalerId: number, updateAccountBookDto: UpdateAccountBookDto) {
    const { date, sellerId, price } = updateAccountBookDto
    await this.accountBookRepository.update(
      { id, wholesalerId }, 
      { date, sellerId, price }
    );
  }
}
