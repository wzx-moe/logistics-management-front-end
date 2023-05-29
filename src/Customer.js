import "./Customer.css"
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {useSortBy, useTable} from 'react-table';
import {Button, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";
import {useNavigate, useParams} from "react-router-dom";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [userInfo, setUserInfo] = useState(null);
    const [myPackages, setMyPackages] = useState([]);
    const [receivedPackages, setReceivedPackages] = useState([]);
    const [modified, setModified] = useState(0)
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const navigate = useNavigate();
    const {name} = useParams();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 获取表单输入的值
        const formData = new FormData(event.target);
        const sendData = Object.fromEntries(formData.entries());

        try {
            // 发送POST请求
            const response = await axios.post(`${apiUrl}/order/add`, sendData); // 替换为你的API端点
            if (response.status === 201) {
                // 处理成功的情况
                alert('寄件请求已成功提交');
                setModified(modified + 1);
            } else {
                // 处理错误情况
                alert('提交失败，服务器返回了错误状态码');
            }
        } catch (error) {
            // 处理网络错误等无法到达服务器的情况
            alert('提交失败，无法连接到服务器');
        }
    };

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/getName/${name}`);
                setUserInfo(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserInfo();
    }, [apiUrl, name]);

    useEffect(() => {
        if (userInfo != null) {
            const fetchPackages = async () => {
                try {
                    const sentPackagesResponse = await axios.get(`${apiUrl}/order/getSenderName/${userInfo.name}`);
                    setMyPackages(sentPackagesResponse.data);

                    const receivedPackagesResponse = await axios.get(`${apiUrl}/order/getReceiverName/${userInfo.name}`);
                    setReceivedPackages(receivedPackagesResponse.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchPackages();
        }
    }, [apiUrl, userInfo, modified]);

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const sendData = Object.fromEntries(formData.entries());
        sendData.fromName = userInfo.name; // 从 userInfo 获取评论者姓名

        try {
            const response = await axios.post(`${apiUrl}/review/add`, sendData);

            if (response.status === 201) {
                alert('评论已成功提交');
                setModified(modified + 1);
            } else {
                alert('提交失败，服务器返回了错误状态码');
            }
        } catch (error) {
            alert('提交失败，无法连接到服务器');
        }
    };


    const handleFinishOrder = useCallback((order) => {
        try {
            order.status = "已取件";
            // 调用接受订单的 API
            axios.post(`${apiUrl}/order/update/${order.orderID}`,
                order).then(() => {
                // 更新订单列表
                setModified(modified + 1);
            });
        } catch (err) {
            console.error(err);
        }
    }, [apiUrl, modified]);

    const columns = useMemo(
        () => [
            {Header: '运单号', accessor: 'orderID'},
            {Header: '寄件人地址', accessor: 'pickupAddress'},
            {Header: '收件人地址', accessor: 'deliveryAddress'},
            {Header: '状态', accessor: 'status'},
        ],
        []
    );

    const receivedColumns = useMemo(
        () => [
            {Header: '运单号', accessor: 'orderID'},
            {Header: '寄件人地址', accessor: 'pickupAddress'},
            {Header: '收件人地址', accessor: 'deliveryAddress'},
            {Header: '状态', accessor: 'status'},
            {
                Header: '操作',
                accessor: 'actions',
                Cell: ({row: {original}}) => (
                    <>
                        {original.status === "待取件" &&
                            <Button onClick={() => handleFinishOrder(original)}>
                                取件
                            </Button>}
                    </>
                ),
            },
        ],
        [handleFinishOrder]
    );

    const sentTableInstance = useTable({columns, data: myPackages}, useSortBy);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: sentRows,
        prepareRow,
    } = sentTableInstance;


    const receivedTableInstance = useTable({columns: receivedColumns, data: receivedPackages}, useSortBy);
    const {
        getTableProps: getReceivedTableProps,
        getTableBodyProps: getReceivedTableBodyProps,
        headerGroups: headerReceivedGroups,
        rows: receivedRows,
        prepareRow: prepareReceivedRow,
    } = receivedTableInstance;

    return (
        <div className="centered-content left-align">
            {userInfo && (
                <div className="user-info">
                    <h2>用户名：{userInfo.name}</h2>
                    <h3>使用软件的第 {new Date().getDate() - new Date(userInfo.register).getDate() + 1} 天</h3>
                    <h3>id：{userInfo.id}</h3>
                    <Button onClick={() => navigate('/chat')}>
                        聊天
                    </Button>
                    <Button onClick={() => navigate('/logout')}>
                        退出登录
                    </Button>
                </div>
            )}

            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '1'})}
                        onClick={() => {
                            toggle('1');
                        }}
                    >
                        我的寄件
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '2'})}
                        onClick={() => {
                            toggle('2');
                        }}
                    >
                        我的收件
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '3'})}
                        onClick={() => {
                            toggle('3');
                        }}
                    >
                        去寄件
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '4'})}
                        onClick={() => {
                            toggle('4');
                        }}
                    >
                        评论
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <table {...getTableProps()} style={{margin: 'auto', width: '80%'}}>
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
                                <tr onClick={() => navigate(`/package-detail`)} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </TabPane>
                <TabPane tabId="2">
                    <table {...getReceivedTableProps()} style={{margin: 'auto', width: '80%'}}>
                        <thead>
                        {headerReceivedGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getReceivedTableBodyProps()}>
                        {receivedRows.map((row) => {
                            prepareReceivedRow(row);
                            prepareReceivedRow(row);
                            return (
                                <tr onClick={() => navigate(`/package-detail`)} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </TabPane>
                <TabPane tabId="3">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="senderName">寄件人真实姓名</Label>
                            <Input type="text" name="senderName" id="senderName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="senderAddress">寄件人有效地址</Label>
                            <Input type="text" name="pickupAddress" id="senderAddress"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="senderPhone">寄件人手机号码</Label>
                            <Input type="text" name="senderPhone" id="senderPhone"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="receiverName">收件人真实姓名</Label>
                            <Input type="text" name="receiverName" id="receiverName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="receiverAddress">收件人有效地址</Label>
                            <Input type="text" name="deliveryAddress" id="receiverAddress"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="receiverPhone">收件人手机号码</Label>
                            <Input type="text" name="receiverPhone" id="receiverPhone"/>
                        </FormGroup>
                        <FormGroup tag="fieldset">
                            <Label>上门取件付款方式</Label>
                            <FormGroup check>
                                <Input type="radio" value="寄付现结" name="paymentMethod"/>{' '}
                                <Label check>
                                    寄付现结
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Input type="radio" value="货到付款" name="paymentMethod"/>{' '}
                                <Label check>
                                    货到付款
                                </Label>
                            </FormGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="pickupTime">取件时间</Label>
                            <Input placeholder={new Date()} type="date" name="orderDate" id="pickupTime"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="deliveryTime">送达时间</Label>
                            <Input placeholder={new Date(new Date().setDate(new Date().getDate() + 3))}
                                   type="date" name="deliveryDate" id="deliveryTime"/>
                        </FormGroup>
                        <FormGroup tag="fieldset">
                            <Label>运费险</Label>
                            <FormGroup check>
                                <Input type="radio" value="是" name="insurance"/>{' '}
                                <Label check>
                                    是
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Input type="radio" value="否" name="insurance"/>{' '}
                                <Label check>
                                    否
                                </Label>
                            </FormGroup>
                        </FormGroup>
                        <Button type="submit">提交</Button>
                    </Form>
                </TabPane>
                <TabPane tabId="4">
                    <Form onSubmit={handleReviewSubmit}>
                        <FormGroup>
                            <Label for="toName">评论对象</Label>
                            <Input type="text" name="toName" id="toName" required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="rating">评分</Label>
                            <Input type="number" min="1" max="5" name="rating" id="rating" required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="context">评论</Label>
                            <Input type="textarea" name="context" id="context" required/>
                        </FormGroup>
                        <Button type="submit">提交评论</Button>
                    </Form>
                </TabPane>
            </TabContent>
        </div>
    );
};

export default HomePage;
