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

const Manager = () => {
    const [activeTab, setActiveTab] = useState('1');

    const [managerData, setManagerData] = useState([]);
    const [warehouseData, setWarehouseData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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
                            <CardTitle tag="h5">Manager Information</CardTitle>
                            <CardText>Name: {managerData.name}</CardText>
                        </CardBody>
                    </Card>

                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({active: activeTab === '1'})} onClick={() => {
                                toggle('1');
                            }}>
                                Warehouse Manager
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({active: activeTab === '2'})} onClick={() => {
                                toggle('2');
                            }}>
                                Support
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({active: activeTab === '3'})} onClick={() => {
                                toggle('3');
                            }}>
                                Driver
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            {warehouseData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>Name: {item.name}</CardText>
                                        <CardText>Contact Number: {item.contact}</CardText>
                                        <CardText>Email: {item.email}</CardText>
                                        <CardText>Managed Warehouse: {item.managed_warehouse}</CardText>
                                        <CardText>Working Hours: {item.working_hours}</CardText>
                                        <CardText>Work Attitude: {item.attitude}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="2 ">
                            {supportData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>Name: {item.name}</CardText>
                                        <CardText>Contact Number: {item.contact}</CardText>
                                        <CardText>Email: {item.email}</CardText>
                                        <CardText>Received Complaints: {item.complaints}</CardText>
                                        <CardText>Working Hours: {item.working_hours}</CardText>
                                        <CardText>Work Attitude: {item.attitude}</CardText>
                                    </CardBody>
                                </Card>
                            ))}
                        </TabPane>
                        <TabPane tabId="3">
                            {driverData.map((item, index) => (
                                <Card key={index}>
                                    <CardBody>
                                        <CardText>Name: {item.name}</CardText>
                                        <CardText>Contact Number: {item.contact}</CardText>
                                        <CardText>Email: {item.email}</CardText>
                                        <CardText>Driving Years: {item.driving_years}</CardText>
                                        <CardText>Working Hours: {item.working_hours}</CardText>
                                        <CardText>Work Attitude: {item.attitude}</CardText>
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