import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const handleLogin = async (role) => {
        try {
            const response = await axios.post(`${apiUrl}/login`, {
                account,
                password,
                smsCode,
                phoneNumber,
                role,
            });

            if (response.status === 200) {
                // 登录成功，根据角色跳转到对应主页面
                switch(role) {
                    case 'customer':
                        navigate('/customer');
                        break;
                    case 'driver':
                        navigate('/driver');
                        break;
                    case 'warehouse':
                        navigate('/warehouse');
                        break;
                    case 'customer-service':
                        navigate('/customer-service');
                        break;
                    case 'manager':
                        navigate('/manager');
                        break;
                    default:
                        // 无效角色处理
                        break;
                }
            } else {
                // 显示错误信息
            }
        } catch (error) {
            // 处理错误，例如显示错误信息
        }
    };

    return (
        <div>
            <h1>CoCo物流管理系统</h1>
            <Form>
                <FormGroup>
                    <Label for="account">账号：</Label>
                    <Input type="text" id="account" onChange={e => setAccount(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="password">密码：</Label>
                    <Input type="password" id="password" onChange={e => setPassword(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="smsCode">短信验证码：</Label>
                    <Input type="text" id="smsCode" onChange={e => setSmsCode(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="phoneNumber">手机号：</Label>
                    <Input type="text" id="phoneNumber" onChange={e => setPhoneNumber(e.target.value)} />
                </FormGroup>
                <Button onClick={() => handleLogin('customer')}>客户登入</Button>
                <Button onClick={() => handleLogin('driver')}>司机登入</Button>
                <Button onClick={() => handleLogin('warehouse')}>仓库管理登入</Button>
                <Button onClick={() => handleLogin('customer-service')}>客服登入</Button>
                <Button onClick={() => handleLogin('manager')}>经理登入</Button>
            </Form>
        </div>
    );
};

export default Login;
