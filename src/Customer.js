import "./Customer.css"
import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {useSortBy, useTable} from 'react-table';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink, TabContent,
    TabPane
} from "reactstrap";
import classnames from "classnames";
import {useNavigate, useParams} from "react-router-dom";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [userInfo, setUserInfo] = useState(null);
    const [myPackages, setMyPackages] = useState([]);
    const [receivedPackages, setReceivedPackages] = useState([]);
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
    }, [apiUrl, userInfo]);

    const columns = useMemo(
        () => [
            {Header: '运单号', accessor: 'orderID'},
            {Header: '寄件人地址', accessor: 'pickupAddress'},
            {Header: '收件人地址', accessor: 'deliveryAddress'},
            {Header: '状态', accessor: 'status'},
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: sentRows,
        prepareRow,
    } = useTable({columns, data: myPackages}, useSortBy);

    const {
        rows: receivedRows,
    } = useTable({columns, data: receivedPackages}, useSortBy);

    return (
        <div className="centered-content left-align">
            {userInfo && (
                <div>
                    <h2>用户名：{userInfo.name}</h2>
                    <h3>使用软件的第 {new Date().getDate() - new Date(userInfo.register).getDate() + 1} 天</h3>
                    <h3>id：{userInfo.id}</h3>
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
                        {receivedRows.map((row) => {
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
                <TabPane tabId="3">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5"></CardTitle>
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
                                        <Label check>
                                            <Input type="radio" name="paymentMethod"/>{' '}
                                            寄付现结
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="paymentMethod"/>{' '}
                                            货到付款
                                        </Label>
                                    </FormGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="pickupTime">取件时间</Label>
                                    <Input type="text" name="orderDate" id="pickupTime"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="deliveryTime">送达时间</Label>
                                    <Input type="text" name="deliveryDate" id="deliveryTime"/>
                                </FormGroup>
                                <FormGroup tag="fieldset">
                                    <legend>运费险</legend>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="insurance"/>{' '}
                                            是
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="insurance"/>{' '}
                                            否
                                        </Label>
                                    </FormGroup>
                                </FormGroup>
                                <Button type="submit">提交</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </TabPane>
                <TabPane tabId="4">
                    {/*            评论*/}
                </TabPane>
            </TabContent>
        </div>
    );
};

export default HomePage;
