import React, { useEffect, useState, useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationComponent = ({ //DataTable 에서 total = 총 데이터갯수, itemPerpages = 50, currentPage=1
    total,
    itemsPerPage,
    currentPage,
    onPageChange
}) => {
    const [totalPages, setTotalPages] = useState(0);
   
    useEffect(() => { 
        if (total > 0 && itemsPerPage > 0)
            setTotalPages(Math.ceil(total / itemsPerPage)); // (500/50) =>totalPages =  10
    }, [total, itemsPerPage]);

    const paginationItems = useMemo(() => { //totalPages, 랑 currentPage 변할때 발생, 
        const pages = [];

        for (let i = 1; i <= totalPages; i++) { //1~10 10번 반복 얘 때문에 0~9 가 아닌, 1부터 10이
            pages.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        return pages;
    }, [totalPages, currentPage]); //페이지 수가 바뀌면 발생

    if (totalPages === 0) return null;
console.log("paginationItems",{paginationItems});
    return (
        <Pagination>
            <Pagination.Prev
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
            {paginationItems}
            <Pagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    );
};

export default PaginationComponent;
