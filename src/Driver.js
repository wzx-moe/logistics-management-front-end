import React, {useCallback, useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import {useSortBy, useTable} from "react-table";
import classnames from "classnames";

const Driver = () => {
    const [driver, setDriver] = useState({});
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const [modified, setModified] = useState(0)
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const {name} = useParams();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


    useEffect(() => {
        // 从后端获取客服信息和用户评价
        async function fetchUserInfo() {
            try {
                axios.get(`${apiUrl}/user/getName/${name}`).then((response) => {
                    setDriver(response.data);
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchUserInfo();
    }, [apiUrl, name]);

    useEffect(() => {
        async function fetchData() {
            try {
                axios.get(`${apiUrl}/order/getDriverIDPending/${driver.id}`).then((response) => {
                    setPendingOrders(response.data);
                });

                axios.get(`${apiUrl}/order/getDriverIDCompleted/${driver.id}`).then((response) => {
                    setCompletedOrders(response.data);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [apiUrl, driver, modified]);

    const handleAcceptOrder = useCallback((order) => {
        order.status = "待取件";
        // 调用接受订单的 API
        axios.post(`${apiUrl}/order/update/${order.orderID}`,
            order).then(() => {
            // 更新订单列表
            setModified(modified + 1);
        });
    }, [apiUrl, modified]);

    const handleRejectOrder = useCallback((order) =>  {
        order.driverID = null;
        order.driverName = null;
        // 调用拒绝订单的 API
        axios.post(`${apiUrl}/order/update/${order.orderID}`,
            order).then(() => {
            // 更新订单列表
            setModified(modified + 1);
        });
    }, [apiUrl, modified]);

    const pendingColumns = useMemo(
        () => [
            {Header: '运单号', accessor: 'orderID'},
            {Header: '寄件人名字', accessor: 'senderName'},
            {Header: '取货日期', accessor: 'orderDate'},
            {Header: '送货日期', accessor: 'deliveryDate'},
            {Header: '地址', accessor: order => `${order.pickupAddress} 到 ${order.deliveryAddress}`},
            {
                Header: '操作',
                accessor: 'actions',
                Cell: ({row: {original}}) => (
                    <>
                        <Button onClick={() => handleAcceptOrder(original)}>
                            接受
                        </Button>
                        <Button onClick={() => handleRejectOrder(original)}>
                            拒绝
                        </Button>
                    </>
                ),
            },
        ],
        [handleAcceptOrder, handleRejectOrder]
    );

    const completedColumns = useMemo(
        () => [
            {Header: '运单号', accessor: 'orderID'},
            {Header: '寄件人名字', accessor: 'senderName'},
            {Header: '取货日期', accessor: 'orderDate'},
            {Header: '送货日期', accessor: 'deliveryDate'},
            {Header: '地址', accessor: order => `${order.pickupAddress} 到 ${order.deliveryAddress}`},
            {Header: '状态', accessor: 'status'},
        ],
        []
    );

    const {
        getTableProps: getPendingTableProps,
        getTableBodyProps: getPendingTableBodyProps,
        headerGroups: pendingHeaderGroups,
        rows: pendingRows,
        prepareRow: preparePendingRow,
    } = useTable({columns: pendingColumns, data: pendingOrders}, useSortBy);

    const {
        getTableProps: getCompletedTableProps,
        getTableBodyProps: getCompletedTableBodyProps,
        headerGroups: completedHeaderGroups,
        rows: completedRows,
        prepareRow: prepareCompletedRow,
    } = useTable({columns: completedColumns, data: completedOrders}, useSortBy);


    return (
        <div className="centered-content left-align">
            <div className="user-info">
                <h2>司机主页面</h2>
                <h3>司机ID：{driver.id}</h3>
                <h3>身份码：{driver.identityCode}</h3>
                <Button variant="secondary" onClick={() => navigate('/logout')}>
                    退出登录
                </Button>
            </div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '1'})}
                        onClick={() => setActiveTab('1')}
                    >
                        待处理订单
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '2'})}
                        onClick={() => setActiveTab('2')}
                    >
                        历史订单
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                <div>
                    <table {...getPendingTableProps()} style={{margin: 'auto', width: '80%'}}>
                        <thead>
                        {pendingHeaderGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getPendingTableBodyProps()}>
                        {pendingRows.map((row) => {
                            preparePendingRow(row);
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
                </TabPane>
                <TabPane tabId="2">
                <div>
                    <table {...getCompletedTableProps()} style={{margin: 'auto', width: '80%'}}>
                        <thead>
                        {completedHeaderGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getCompletedTableBodyProps()}>
                        {completedRows.map((row) => {
                            prepareCompletedRow(row);
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
                </TabPane>
            </TabContent>
        </div>
    );
};

export default Driver;
