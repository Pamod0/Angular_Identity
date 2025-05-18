export interface PagedRequest {
  page: number;
  pageSize: number;
  searchText?: string;
  exactMatch?: boolean;
}
