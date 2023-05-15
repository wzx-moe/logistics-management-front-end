import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        username: '',
        daysUsed: '',
        id: '',
    });
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        fetch(`${apiUrl}/user-info`)
            .then(response => response.json())
            .then(data => setUserInfo(data));
    }, [apiUrl]);

    return (
        <div>
            <h1>用户名：{userInfo.username}</h1>
            <p>这是你使用软件的第{userInfo.daysUsed}天</p>
            <p>ID：{userInfo.id}</p>
            <Button onClick={() => navigate('/my-sending')}>我的寄件</Button>
            <Button onClick={() => navigate('/history-orders')}>历史订单</Button>
            <Button onClick={() => navigate('/my-receiving')}>我的收件</Button>
            <Button onClick={() => navigate('/go-sending')}>去寄件</Button>
            <Button onClick={() => {
                navigate('/logout');
            }}>退出登录</Button>
        </div>
    );
};

export default Customer;
