import { User } from '../entities/user.entity';

export interface PaginatedUsers {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}