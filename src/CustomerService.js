import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from 'reactstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';

function CustomerService() {
    const [reviews, setReviews] = useState([]);
    const [serviceInfo, setServiceInfo] = useState({id: '', nickname: ''});
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        // 从后端获取客服信息和用户评价
        async function fetchData() {
            try {
                const responseServiceInfo = await axios.get(`${apiUrl}/api/serviceInfo`); // 替换为你的API
                setServiceInfo(responseServiceInfo.data);

                const responseReviews = await axios.get(`${apiUrl}/api/reviews`); // 替换为你的API
                setReviews(responseReviews.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [apiUrl]);

    return (
        <Container>
            <Row>
                <Col>
                    <h2>客服ID：{serviceInfo.id}</h2>
                    <h3>客服昵称：{serviceInfo.nickname}</h3>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2>用户评价：</h2>
                    {reviews.map((review, index) => (
                        <p key={index}>用户{review.userId}：{review.comment} {review.rating}星</p>
                    ))}
                </Col>
            </Row>

            <Row>
                <Col>
                    <Link to="/chat">进入聊天页面</Link>
                </Col>
            </Row>
        </Container>
    );
}

export default CustomerService;
