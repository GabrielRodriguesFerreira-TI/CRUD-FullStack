import { Document, Model } from "mongoose";

interface IPaginateOptions {
  page: number;
  limit: number;
}

export interface iCustomModel<T extends Document> extends Model<T> {
  createAndFillEmailsAndTelephones(payload: { fullName: string; password: string; email: string; telephone: string; }): unknown;
  paginate(
    query?: any,
    options?: IPaginateOptions
  ): Promise<{
    docs: T[];
    totalDocs: number;
    limit: number;
    page?: number;
    totalPages?: number;
    nextPage?: number | null;
    prevPage?: number | null;
    pagingCounter?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    meta?: any;
  }>;
}
