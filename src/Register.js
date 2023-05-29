import React, {useState} from 'react';
import axios from 'axios';
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${apiUrl}/user/add`, {
                name: username,
                password,
                email,
                phoneNumber: phone,
                address,
                role,
            });

            if (response.status === 201) {
                alert('注册成功');
                // 注册成功，跳转到登录页面
                navigate('/');
            } else {
                // 显示错误信息
                alert(response.data)
            }
        } catch (error) {
            // 处理错误，例如显示错误信息
            alert(error)
        }
    };

    return (
        <div className="centered-content">
            <h1>CoCo物流管理系统注册</h1>
            <Form className="form-width">
                <FormGroup className="mb-3">
                    <Label for="account" className="form-label">账号：</Label>
                    <Input type="text" id="account" onChange={e => setUsername(e.target.value)}
                           className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="password" className="form-label">密码：</Label>
                    <Input type="password" id="password" onChange={e => setPassword(e.target.value)}
                           className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="email" className="form-label">电子邮箱：</Label>
                    <Input type="email" id="email" onChange={e => setEmail(e.target.value)}
                           className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="phoneNumber" className="form-label">手机号：</Label>
                    <Input type="text" id="phoneNumber" onChange={e => setPhone(e.target.value)}
                           className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="address" className="form-label">地址：</Label>
                    <Input type="text" id="address" onChange={e => setAddress(e.target.value)}
                           className="form-control"/>
                </FormGroup>
                <FormGroup className="mb-3">
                    <Label for="role" className="form-label">角色：</Label>
                    <Input type="select" id="role" onChange={e => setRole(e.target.value)}
                           className="form-control">
                        <option value="customer">客户</option>
                        <option value="driver">司机</option>
                        <option value="warehouse">仓库管理</option>
                        <option value="customer-service">客服</option>
                        <option value="manager">经理</option>
                    </Input>
                </FormGroup>
                <Button onClick={handleRegister} className="btn mt-2">注册</Button>
            </Form>
        </div>
    );
};

export default Register;
