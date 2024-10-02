import { RegisterProduct } from '../entities/register-product.entity';

export interface PaginatedRegisterProducts {
  data: RegisterProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}