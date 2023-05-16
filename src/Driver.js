import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Button, Table} from 'reactstrap';

const Driver = () => {
    const [driver, setDriver] = useState({});
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [showPendingOrders, setShowPendingOrders] = useState(true);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {

        axios.get(`${apiUrl}/driver`).then((response) => {
            setDriver(response.data);
        });

        axios.get(`${apiUrl}/pendingOrders`).then((response) => {
            setPendingOrders(response.data);
        });

        axios.get(`${apiUrl}/completedOrders`).then((response) => {
            setCompletedOrders(response.data);
        });
    }, [apiUrl]);

    const handleAcceptOrder = (orderId) => {
        // 调用接受订单的 API
        axios.post(`${apiUrl}/acceptOrder`, {orderId}).then(() => {
            // 更新订单列表
            setPendingOrders(pendingOrders.filter((order) => order.id !== orderId));
        });
    };

    const handleRejectOrder = (orderId) => {
        // 调用拒绝订单的 API
        axios.post(`${apiUrl}/rejectOrder`, {orderId}).then(() => {
            // 更新订单列表
            setPendingOrders(pendingOrders.filter((order) => order.id !== orderId));
        });
    };

    return (
        <div>
            <h1>司机主页面</h1>
            <p>司机ID：{driver.id}</p>
            <p>身份码：{driver.identityCode}</p>
            <Button variant="primary" onClick={() => setShowPendingOrders(true)}>
                待处理订单
            </Button>
            <Button variant="secondary" onClick={() => setShowPendingOrders(false)}>
                历史订单
            </Button>
            {showPendingOrders ? (
                <div>
                    <h2>待处理订单</h2>
                    <Table striped bordered hover>
                        {pendingOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.adminId}</td>
                                <td>{order.deliveryTime}</td>
                                <td>{`${order.startLocation} 到 ${order.endLocation}`}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleAcceptOrder(order.id)}>
                                        接受
                                    </Button>
                                    <Button variant="danger" onClick={() => handleRejectOrder(order.id)}>
                                        拒绝
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            ) : (
                <div>
                    <h2>历史订单</h2>
                    <Table striped bordered hover>
                        {completedOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.adminId}</td>
                                <td>{order.deliveryTime}</td>
                                <td>{`${order.startLocation} 到 ${order.endLocation}`}</td>
                                <td>已完成</td>
                            </tr>
                        ))}
                    </Table>
                </div>
            )}
            <Button variant="secondary" onClick={() => navigate('/logout')}>
                退出登录
            </Button>
        </div>
    );
};

export default Driver;
