import React, {useEffect, useState} from 'react';
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';
import {useParams} from "react-router-dom";

const Manager = () => {
    const [activeTab, setActiveTab] = useState('1');

    const [managerData, setManagerData] = useState([]);
    const [warehouseData, setWarehouseData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const {name} = useParams();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


    useEffect(() => {
        // 从后端获取信息
        async function fetchData() {
            try {
                const responseManagerData = await axios.get(`${apiUrl}/api/manager`);
                setManagerData(responseManagerData.data);

                const responseWarehouseData = await axios.get(`${apiUrl}/api/warehouse`);
                setWarehouseData(responseWarehouseData.data);

                const responseSupportData = await axios.get(`${apiUrl}/api/support`);
                setSupportData(responseSupportData.data);

                const responseDriverData = await axios.get(`${apiUrl}/api/driver`);
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
        <Container>
            <Row>
                <Col sm="12" md={{size: 6, offset: 3}}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">经理信息</CardTitle>
                            <CardText>姓名: {managerData.name}</CardText>
                        </CardBody>
                    </Card>

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
                                        <CardText>联系电话: {item.contact}</CardText>
                                        <CardText>邮箱: {item.email}</CardText>
                                        <CardText>管理范围: {item.managed_warehouse}</CardText>
                                        <CardText>工作时长: {item.working_hours}</CardText>
                                        <CardText>工作态度: {item.attitude}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="2 ">
                            {supportData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>姓名: {item.name}</CardText>
                                        <CardText>联系电话: {item.contact}</CardText>
                                        <CardText>邮箱: {item.email}</CardText>
                                        <CardText>收到投诉: {item.complaints}</CardText>
                                        <CardText>工作时长: {item.working_hours}</CardText>
                                        <CardText>工作态度: {item.attitude}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="3">
                            {driverData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>姓名: {item.name}</CardText>
                                        <CardText>联系电话: {item.contact}</CardText>
                                        <CardText>邮箱: {item.email}</CardText>
                                        <CardText>工作时长: {item.working_hours}</CardText>
                                        <CardText>工作态度: {item.attitude}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Container>
    );
};

export default Manager;