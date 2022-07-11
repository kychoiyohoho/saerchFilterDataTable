import React, { useEffect, useState, useMemo } from "react";
import Header from "components/Header";
import { TableHeader, Pagination, Search } from "components/DataTable";
import useFullPageLoader from "hooks/useFullPageLoader";
import ExternalInfo from "components/ExternalInfo";
import AppConfig from "App.config";

const DataTable = () => {
    const [comments, setComments] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "No#", field: "id", sortable: false },
        { name: "Name", field: "name", sortable: true },
        { name: "Email", field: "email", sortable: true },
        { name: "Comment", field: "body", sortable: false }
    ];

    useEffect(() => {
        const getData = () => {
            showLoader();

            fetch("https://jsonplaceholder.typicode.com/comments")
                .then(response => response.json())
                .then(json => {
                    hideLoader();
                    setComments(json);
                    console.log(json);
                });
        };//url 에서 데이터를 받고 json형태로 바꾼 데이터를 setComments 에 입력 => comments 가 바뀌어서 useMemo 재랜더링

        getData();
    }, []);

    const commentsData = useMemo(() => { //return 되고 commentsData 는 0~49 까지의 데이터를 가지고 있다, 어떻게 1~50으로 숫자가 바뀌었는지는 찾을 필요있음, PaginationComponent에 있음
        let computedComments = comments;  //모든 데이터를 computedComments 에 전달

        if (search) {  //검색창에 값을 입력하면 또 재 랜더링 발생
            computedComments = computedComments.filter(  //모든 데이터에서 필요한 데이터만 꺼내서 computedComments 에 전달
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length); //totalItems에 총 몇개의 데이터가 있는지 전달

        //Sorting comments, sorting 하는건데, 왜 이렇게 하는지??
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            console.log("reversed",reversed);
            computedComments = computedComments.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedComments.slice( //첫번째 인자값 이사, 두번째 인자값 미만, 가장 초반에 currentPage = 1 이다, Items_per_page 를 더해서 0부터 49이다
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );//page=2 일때 50~100까지의 데이터
        //page =1 일때 1~50 ,  2일때 51~100
    }, [comments, currentPage, search, sorting]);
console.log("commentsData",commentsData);
    return (
        <>
            <Header title="Building a data table in react" />

            <ExternalInfo page="datatable" />

            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        <div className="col-md-6">
                            <Pagination
                                total={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
                        <div className="col-md-6 d-flex flex-row-reverse">
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <table className="table table-striped">
                        <TableHeader
                            headers={headers}
                            onSorting={(field, order) =>
                                setSorting({ field, order })
                            }
                        />
                        <tbody>
                            {commentsData.map(comment => (
                                <tr>
                                    <th scope="row" key={comment.id}>
                                        {comment.id}
                                    </th>
                                    <td>{comment.name}</td>
                                    <td>{comment.email}</td>
                                    <td>{comment.body}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {loader}
        </>
    );
};

export default DataTable;
