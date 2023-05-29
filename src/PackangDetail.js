import React from 'react';
import './PackageDetail.css';
import {Button} from "reactstrap";
import {useNavigate} from "react-router-dom";

function PackageDetail() {
    const navigate = useNavigate();
    const orderNumber = 'SA123xxxx';
    const deliveryInfo = `
    【已揽件】11-20 15:16
    11-20 15:40 快件离开xxx仓库
    11-20 19:50 快件到达xxx仓库
    11-21 12:40 中转xxx仓库已发出
    11-21 1:05 xxx仓库已揽收
    11-21 15:16 您的快件已由xxx负责派送，联系电话189xxxxxxx
    您的快件到达xxx仓库
  `;

    return (
        <div className="centered-content">
            <h2 className="title">物流详细信息</h2>
            <p className="order-number"><strong>订单号：</strong>{orderNumber}</p>
            <p className="logistics-label"><strong>物流信息：</strong></p>
            <pre className="logistics-info">{deliveryInfo}</pre>
            <Button onClick={() => navigate(-1)}>
                返回
            </Button>
        </div>
    );
}

export default PackageDetail;
