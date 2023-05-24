import "./Login.css"
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const handleLogin = async (role) => {
        try {
            const response = await axios.post(`${apiUrl}/api/login`, {
                name: username,
                password,
                smsCode,
                phoneNumber,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data)
                // 登录成功，根据角色跳转到对应主页面
                switch(role) {
                    case 'customer':
                        navigate(`/customer/${username}`);
                        break;
                    case 'driver':
                        navigate(`/driver/${username}`);
                        break;
                    case 'warehouse':
                        navigate(`/warehouse/${username}`);
                        break;
                    case 'customer-service':
                        navigate(`/customer-service/${username}`);
                        break;
                    case 'manager':
                        navigate(`/manager/${username}`);
                        break;
                    default:
                        // 无效角色处理
                        break;
                }
            } else {
                // 显示错误信息
                alert(response.data)
            }
        } catch (error) {
            // 处理错误，例如显示错误信息
            //  alert(error)
        }
    };

    return (
        <div className="centered-content">
            <h1>CoCo物流管理系统</h1>
            <Form>
                <FormGroup className="mb-3">
                    <Label for="account" className="form-label">账号：</Label>
                    <Input type="text" id="account" onChange={e => setUsername(e.target.value)} className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="password" className="form-label">密码：</Label>
                    <Input type="password" id="password" onChange={e => setPassword(e.target.value)} className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="smsCode" className="form-label">短信验证码：</Label>
                    <Input type="text" id="smsCode" onChange={e => setSmsCode(e.target.value)} className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="phoneNumber" className="form-label">手机号：</Label>
                    <Input type="text" id="phoneNumber" onChange={e => setPhoneNumber(e.target.value)} className="form-control"/>
                </FormGroup>
                <Button onClick={() => handleLogin('customer')} className="btn mt-2">客户登入</Button>
                <Button onClick={() => handleLogin('driver')} className="btn mt-2">司机登入</Button>
                <Button onClick={() => handleLogin('warehouse')} className="btn mt-2">仓库管理登入</Button>
                <Button onClick={() => handleLogin('customer-service')} className="btn mt-2">客服登入</Button>
                <Button onClick={() => handleLogin('manager')} className="btn mt-2">经理登入</Button>
            </Form>
        </div>
    );
};

export default Login;
