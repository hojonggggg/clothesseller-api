import { SellerProduct } from '../entities/seller-product.entity';

export interface PaginatedSellerProducts {
  data: SellerProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}