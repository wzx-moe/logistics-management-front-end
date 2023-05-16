import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Button, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, Table, TabPane} from 'reactstrap';
import classnames from 'classnames';

const Warehouse = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [warehouseManager, setWarehouseManager] = useState({});
    const [deliveredParcels, setDeliveredParcels] = useState([]);
    const [pendingParcels, setPendingParcels] = useState([]);
    const [driverInfo, setDriverInfo] = useState({});
    const [form, setForm] = useState({parcelId: '', driverId: ''});
    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        // 记得替换为正确的API URL
        axios.get(`${apiUrl}/api/warehouse-manager-info`)
            .then(response => {
                setWarehouseManager(response.data);
            });
        axios.get(`${apiUrl}/api/delivered-parcels`)
            .then(response => {
                setDeliveredParcels(response.data);
            });
        axios.get(`${apiUrl}/api/pending-parcels`)
            .then(response => {
                setPendingParcels(response.data);
            });
    }, [apiUrl]);

    async function assignOrder(parcelId, driverId) {
        try {
            const response = await axios.post(`${apiUrl}/api/orders/assign`, {
                parcelId,
                driverId
            });

            return response.data;
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }


    const handleDriverSearch = (driverId) => {
        axios.get(`${apiUrl}/api/driver-info/${driverId}`)
            .then(response => {
                setDriverInfo(response.data);
            });
    }


    return (
        <div>
            <h1>仓库管理员主页</h1>
            <p>仓库管理员ID：{warehouseManager.id}</p>
            <p>昵称：{warehouseManager.nickname}</p>

            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '1'})}
                        onClick={() => {
                            toggle('1');
                        }}
                    >
                        已发货快递
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({active: activeTab === '2'})}
                        onClick={() => {
                            toggle('2');
                        }}
                    >
                        未发货快递
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
                    <Table>
                        <thead>
                        <tr>
                            <th>快递ID</th>
                            <th>发货时间</th>
                            <th>负责司机ID</th>
                            <th>是否到达</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deliveredParcels.map(parcel => (
                            <tr key={parcel.id}>
                                <td>{parcel.id}</td>
                                <td>{parcel.deliveryTime}</td>
                                <td>{parcel.driverId}</td>
                                <td>{parcel.arrived ? '是' : '否'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </TabPane>
                <TabPane tabId="2">
                    <Table>
                        <thead>
                        <tr>
                            <th>快递ID</th>
                            <th>发货时间</th>
                            <th>负责司机ID</th>
                            <th>目的地</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingParcels.map(parcel => (
                            <tr key={parcel.id}>
                                <td>{parcel.id}</td>
                                <td>{parcel.deliveryTime}</td>
                                <td>{parcel.driverId}</td>
                                <td>{parcel.destination}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </TabPane>
                <TabPane tabId="3">
                    <Form onSubmit={e => {
                        e.preventDefault();
                        setSubmitting(true);
                        assignOrder(form.parcelId, form.driverId)
                            .then(() => {
                                setForm({ parcelId: '', driverId: '' });
                                // 这里也可以添加一些额外的逻辑，比如刷新订单列表
                            })
                            .catch(err => {
                                console.error(err);
                                // 这里可以添加一些错误处理逻辑，比如显示错误消息
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                    }}>
                        <FormGroup>
                            <Label for="parcelId">快递ID</Label>
                            <Input type="text" name="parcelId" id="parcelId" value={form.parcelId}
                                   onChange={e => setForm({...form, parcelId: e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="driverId">司机ID</Label>
                            <Input type="text" name="driverId" id="driverId" value={form.driverId}
                                   onChange={e => setForm({...form, driverId: e.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="parcelId">快递ID</Label>
                            <Input type="text" name="parcelId" id="parcelId"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="driverId">司机ID</Label>
                            <Input type="text" name="driverId" id="driverId"/>
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
                            <p>司机信息：{driverInfo.info}</p>
                            <p>家庭住址：{driverInfo.address}</p>
                            <p>接单数量：{driverInfo.orderCount}</p>
                            <p>绩效评价：{driverInfo.performance}</p>
                            <p>是否空闲：{driverInfo.isFree ? '是' : '否'}</p>
                        </div>
                    )}
                </TabPane>
            </TabContent>
            <Button variant="secondary" onClick={() => navigate('/logout')}>
                退出登录
            </Button>
        </div>
    );
};

export default Warehouse;