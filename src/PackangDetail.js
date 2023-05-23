import React from 'react';

function PackageDetail() {
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
        <div className="container">
            <h2>物流详细信息</h2>
            <p><strong>订单号：</strong>{orderNumber}</p>
            <p><strong>物流信息：</strong></p>
            <pre>{deliveryInfo}</pre>
        </div>
    );
}

export default PackageDetail;
