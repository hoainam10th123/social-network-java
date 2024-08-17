export interface IPagination<T> {
    totalPages: number;
    count: number;
    pageNumber: number;
    pageSize: number;
    data: T[];
}