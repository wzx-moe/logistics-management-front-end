import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, CardText, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import {useNavigate, useParams} from "react-router-dom";

const Manager = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [managerData, setManagerData] = useState({});
    const [warehouseData, setWarehouseData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const {name} = useParams();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/getName/${name}`);
                setManagerData(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserInfo();
    }, [apiUrl, name]);


    useEffect(() => {
        // 从后端获取信息
        async function fetchData() {
            try {
                const responseWarehouseData = await axios.get(`${apiUrl}/user/getWarehouse`);
                setWarehouseData(responseWarehouseData.data);

                const responseSupportData = await axios.get(`${apiUrl}/user/getCustomerService`);
                setSupportData(responseSupportData.data);

                const responseDriverData = await axios.get(`${apiUrl}/user/getDriver`);
                setDriverData(responseDriverData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [apiUrl]);


    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <div className="centered-content left-align">
            <div className="user-info">
                <h2>经理信息</h2>
                <h3>姓名: {managerData.name}</h3>
                <Button onClick={() => navigate('/logout')}>
                    退出登录
                </Button>
            </div>

            <Nav tabs>
                <NavItem>
                    <NavLink className={classnames({active: activeTab === '1'})} onClick={() => {
                        toggle('1');
                    }}>
                        仓库管理员
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classnames({active: activeTab === '2'})} onClick={() => {
                        toggle('2');
                    }}>
                        客服
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classnames({active: activeTab === '3'})} onClick={() => {
                        toggle('3');
                    }}>
                                司机
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            {warehouseData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>姓名: {item.name}</CardText>
                                        <CardText>联系电话: {item.phone}</CardText>
                                        <CardText>邮箱: {item.email}</CardText>
                                        <CardText>管理范围: {item.managed_warehouse}</CardText>
                                        <CardText>工作时长: {new Date().getDate() - new Date(item.register).getDate() + 1} 天</CardText>
                                        <CardText>工作态度: {item.status}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="2">
                            {supportData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>姓名: {item.name}</CardText>
                                        <CardText>联系电话: {item.phone}</CardText>
                                        <CardText>邮箱: {item.email}</CardText>
                                        <CardText>客户评价: {item.special}</CardText>
                                        <CardText>工作时长: {new Date().getDate() - new Date(item.register).getDate() + 1} 天</CardText>
                                        <CardText>工作态度: {item.status}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="3">
                            {driverData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>姓名: {item.name}</CardText>
                                        <CardText>联系电话: {item.phone}</CardText>
                                        <CardText>邮箱: {item.email}</CardText>
                                        <CardText>工作时长: {new Date().getDate() - new Date(item.register).getDate() + 1} 天</CardText>
                                        <CardText>工作态度: {item.status}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                    </TabContent>
        </div>
    );
};

export default Manager;