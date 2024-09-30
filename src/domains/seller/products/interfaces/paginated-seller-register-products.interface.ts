import { SellerRegisterProduct } from '../entities/seller-register-product.entity';

export interface PaginatedSellerRegisterProducts {
  data: SellerRegisterProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}