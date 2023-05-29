import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import {useSortBy, useTable} from "react-table";

const Warehouse = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [warehouseManager, setWarehouseManager] = useState({});
    const [deliveredParcels, setDeliveredParcels] = useState([]);
    const [pendingParcels, setPendingParcels] = useState([]);
    const [driverInfo, setDriverInfo] = useState({});
    const [drivers, setDrivers] = useState([]);
    const [form, setForm] = useState({parcel: pendingParcels[0] || null, driverId: ''});
    const [isSubmitting, setSubmitting] = useState(false);
    const [modified, setModified] = useState(0)
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const {name} = useParams();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        // 从后端获取客服信息和用户评价
        async function fetchData() {
            try {
                axios.get(`${apiUrl}/user/getName/${name}`)
                    .then(response => {
                        setWarehouseManager(response.data);
                    });
                axios.get(`${apiUrl}/user/getDriver`)
                    .then(response => {
                        setDrivers(response.data);
                    });
                axios.get(`${apiUrl}/order/getCompleted`)
                    .then(response => {
                        setDeliveredParcels(response.data);
                    });
                axios.get(`${apiUrl}/order/getPending`)
                    .then(response => {
                        setPendingParcels(response.data);
                    });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [apiUrl, name, modified]);


    const handleDriverSearch = (driverId) => {
        try {
            axios.get(`${apiUrl}/user/getOne/${driverId}`)
                .then(response => {
                    setDriverInfo(response.data);
                })
                .catch(error => {
                    alert('Error fetching driver ', error);
                });

        } catch (error) {
            alert('Error fetching data:' + error);
        }
    }

    const deliveredColumns = useMemo(
        () => [
            {Header: '快递ID', accessor: 'orderID'},
            {Header: '发货时间', accessor: 'orderDate'},
            {Header: '负责司机ID', accessor: 'driverID'},
            {Header: '状态', accessor: 'status'},
        ],
        []
    );

    const pendingColumns = useMemo(
        () => [
            {Header: '快递ID', accessor: 'orderID'},
            {Header: '发货时间', accessor: 'orderDate'},
            {Header: '发货地', accessor: 'pickupAddress'},
            {Header: '目的地', accessor: 'deliveryAddress'},
        ],
        []
    );

    const {
        getTableProps: getDeliveredTableProps,
        getTableBodyProps: getDeliveredTableBodyProps,
        headerGroups: deliveredHeaderGroups,
        rows: deliveredRows,
        prepareRow: prepareDeliveredRow,
    } = useTable({columns: deliveredColumns, data: deliveredParcels}, useSortBy);

    const {
        getTableProps: getPendingTableProps,
        getTableBodyProps: getPendingTableBodyProps,
        headerGroups: pendingHeaderGroups,
        rows: pendingRows,
        prepareRow: preparePendingRow,
    } = useTable({columns: pendingColumns, data: pendingParcels}, useSortBy);

    // 提交表单的函数
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // 构建更新后的parcel对象
        const updatedParcel = {...form.parcel, driverID: form.driverId};

        try {
            // 提交更新后的parcel对象
            const response = await axios.post(`${apiUrl}/order/update/${updatedParcel.orderID}`, updatedParcel);

            // 处理响应，更新状态等
            if (response.status === 200) {
                // 更新成功，可以清除表单或进行其他操作
                setForm({
                    parcel: "",
                    driverId: "",
                });
                setSubmitting(false);
                setModified(modified + 1);
            }
        } catch (err) {
            console.error(err);
            setSubmitting(false);
        }
    };

    return (
        <div className="centered-content left-align">
            <div className="user-info">
                <h2>仓库管理员主页</h2>
                <h3>仓库管理员ID：{warehouseManager.id}</h3>
                <h3>昵称：{warehouseManager.name}</h3>
                <Button onClick={() => navigate('/logout')}>
                    退出登录
                </Button>
            </div>

            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '1'})}
                        onClick={() => {
                            toggle('1');
                        }}
                    >
                        已分配快递
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '2'})}
                        onClick={() => {
                            toggle('2');
                        }}
                    >
                        未分配快递
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '3'})}
                        onClick={() => {
                            toggle('3');
                        }}
                    >
                        分配订单
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '4'})}
                        onClick={() => {
                            toggle('4');
                        }}
                    >
                        司机个人信息
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <table {...getDeliveredTableProps()} style={{margin: 'auto', width: '80%'}}>
                        <thead>
                        {deliveredHeaderGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getDeliveredTableBodyProps()}>
                        {deliveredRows.map((row) => {
                            prepareDeliveredRow(row);
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
                </TabPane>
                <TabPane tabId="2">
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
                </TabPane>
                <TabPane tabId="3">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="parcelId">快递ID</Label>
                            <Input type="select" name="parcelId" id="parcelId"
                                   value={form.parcel && form.parcel.orderID}
                                   onChange={e => {
                                       const selectedParcel = pendingParcels.find(parcel => parcel.orderID === e.target.value);
                                       setForm({...form, parcel: selectedParcel});
                                   }}>
                                <option key="" value="">请选择一个快递</option>
                                {pendingParcels.map(parcel => (
                                    <option key={parcel.orderID} value={parcel.orderID}>
                                        {parcel.orderID} - {parcel.pickupAddress} 到 {parcel.deliveryAddress} - {parcel.orderDate} 到 {parcel.deliveryDate}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="driverId">司机ID</Label>
                            <Input type="select" name="driverId" id="driverId" value={form.driverId}
                                   onChange={e => setForm({...form, driverId: e.target.value})}>
                                <option key="" value="">请选择一个司机</option>
                                {drivers.map(driver => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.id} - {driver.name} - 状态: {driver.status || '未知'}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <Button type="submit" color="primary" disabled={isSubmitting}>提交</Button>
                    </Form>
                </TabPane>
                <TabPane tabId="4">
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleDriverSearch(e.target.elements.driverId.value);
                    }}>
                        <FormGroup>
                            <Label for="driverId">司机ID</Label>
                            <Input type="text" name="driverId" id="driverId" placeholder="请输入司机ID"/>
                        </FormGroup>
                        <Button type="submit" color="primary">搜索</Button>
                    </Form>
                    {driverInfo && (
                        <div>
                            <p>司机名称：{driverInfo.name}</p>
                            <p>家庭住址：{driverInfo.address}</p>
                            <p>工作时间：{new Date().getDate() - new Date(driverInfo.register).getDate() + 1} 天</p>
                            <p>绩效评价：{driverInfo.special}</p>
                            <p>是否空闲：{driverInfo.status || '未知'}</p>
                        </div>
                    )}
                </TabPane>
            </TabContent>
        </div>
    );
};

export default Warehouse;