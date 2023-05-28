import React, {useEffect, useMemo, useState} from 'react';
import {Button} from 'reactstrap';
import {useSortBy, useTable} from 'react-table';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

function CustomerService() {
    const [reviews, setReviews] = useState([]);
    const [serviceInfo, setServiceInfo] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const navigate = useNavigate();
    const {name} = useParams();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

    const columns = useMemo(
        () => [
            {Header: '用户', accessor: 'fromName'},
            {Header: '对象', accessor: 'toName'},
            {Header: '内容', accessor: 'context'},
            {Header: '评价', accessor: 'rating'},
        ],
        []
    );

    const sentTableInstance = useTable({columns, data: reviews}, useSortBy);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: sentRows,
        prepareRow,
    } = sentTableInstance;

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/getName/${name}`);
                setServiceInfo(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserInfo();
    }, [apiUrl, name]);

    useEffect(() => {
        // 从后端获取客服信息和用户评价
        async function fetchData() {
            try {
                const responseReviews = await axios.get(`${apiUrl}/review/getAll`);
                setReviews(responseReviews.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [apiUrl]);

    return (
        <div className="centered-content left-align">
            <div className="user-info">
                <h2>客服ID：{serviceInfo.id}</h2>
                <h3>客服昵称：{serviceInfo.name}</h3>
                <Button onClick={() => navigate('/chat')}>
                    进入聊天页面
                </Button>
                <Button onClick={() => navigate('/logout')}>
                    退出登录
                </Button>
            </div>

            <h4>用户评价：</h4>
            <table {...getTableProps()} style={{width: '80%'}}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {sentRows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
}

export default CustomerService;
