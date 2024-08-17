"use client"

import { DOTS, usePagination } from '@/app/lib/helper';
import Pagination from 'react-bootstrap/Pagination';

//https://github.com/mayankshubham/react-pagination/blob/master/src/examples/App.js

interface Props {
    onPageChange: (pageNumber: number) => void;
    totalCount: number;
    siblingCount?: number;
    currentPage: number;
    pageSize: number;
}

export default function CustomPagination({ onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize }: Props) {

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || paginationRange!.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange![paginationRange!.length - 1];

    return (
        <Pagination style={{marginTop: 5}}>
            <Pagination.Prev disabled={currentPage === 1} onClick={onPrevious} />
            {paginationRange!.map(pageNumber => {
                if (pageNumber === DOTS) {
                    return <Pagination.Ellipsis />
                }

                return (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => onPageChange(pageNumber)}>
                        {pageNumber}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next onClick={onNext} disabled={currentPage === lastPage} />
        </Pagination>
    )
}