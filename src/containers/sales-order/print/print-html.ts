import math from '@sipin/basic-libs/lib/js/math';
/**
 * getPrintHtml
 * @export getPrintHtml
 * @param {*} order 订单
 * @param {*} { shop, agency }
 * @returns {string} html
 */
export default function getPrintHtml(order: any, { setting, shop }): string {
  const list = order.orderDetailList.map(item => {
    return `
    <tr>
      <td>
        <div class="bold">${item.name}</div>
        <div>${item.skuNo}</div>
      </td>
      <td>￥${item.discountAmount && item.discountAmount.toFixed(2)}</td>
      <td>x${item.quantity}</td>
    </tr>`;
  });

  // 优惠券
  const couponAmount =
    order.couponAmount > 0
      ? `
    <tr>
      <td>优惠券</td>
      <td>-￥${order.couponAmount}</td>
    </tr>
  `
      : '';
  // 积分
  const pointsDiscount =
    order.pointsDiscount > 0
      ? `
    <tr>
      <td>积分</td>
      <td>-￥${order.pointsDiscount}</td>
    </tr>
  `
      : '';
  // 整单优惠
  const orderDiscount = math.Sub(
    order.originalPayableAmount,
    order.payableAmount,
    2
  );
  const orderDiscountHtml =
    +orderDiscount > 0
      ? `
    <tr>
      <td>整单优惠</td>
      <td>-￥${orderDiscount}</td>
    </tr>
  `
      : '';

  // 找零
  const givenChange =
    order.payableAmount < order.paidAmount
      ? math.Sub(order.paidAmount, order.payableAmount, 2)
      : '0.00';
  const givenChangeHtml = `<div>找零: ￥${givenChange}</div>`;

  // 支付明细
  const paymentList = order.paymentResponseList.map((item, i) => {
    const isLast = order.paymentResponseList.length - 1 === i ? true : false;

    return `<tr>
      <td>
        <div>￥${item.price && item.price.toFixed(2)}</div>
        ${isLast && +givenChange > 0 ? givenChangeHtml : ''}
      </td>
      <td>
        <div>${item.paymentMethod}</div>
        <div>${item.paidAt}</div>
      </td>
    </tr>`;
  });
  const paymentListContainer = paymentList.length
    ? `
    <div class="sub-title">支付记录</div>
    <table class="payment-table">
      <tbody>
        ${paymentList.join('')}
      </tbody>
    </table>
    <div class="dashed"></div>
  `
    : '';

  // 收货信息
  const orderConsignee = order.orderConsignee
    ? `
    <div class="sub-title">收货信息</div>
    <table>
      <tbody>
      <tr>
        <td>收货人： ${order.orderConsignee.name}</td>
      </tr>
      <tr>
        <td>收货地址： ${order.orderConsignee.mobile}</td>
      </tr>
      <tr>
        <td>联系电话： ${order.orderConsignee.addr}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
  `
    : '';

  return `
    <style>
      * {
        font-size: 12px;
        font-family: Microsoft YaHei,Hiragino Sans GB,PingHei,stheiti,WenQuanYi Micro Hei,sans-serif;
      }
      .mb-10 {
        margin-bottom: 10px;
      }
      .mb-5 {
        margin-bottom: 5px;
      }
      .bold {
        font-weight: 900;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center
      }
      .dashed {
        border-top: 1px dashed #000;
      }
      .logo {
        font-size: 20px;
      }
      table {
        width: 100%;
        table-layout: fixed;
      }
      th {
        border-top: 1px dashed #000;
        border-bottom: 1px dashed #000;
        text-align: left;
        padding: 10px 10px 2px;
        font-weight: normal;
      }
      td {
        padding: 4px 10px;
      }
      th:last-child,
      td:last-child {
        text-align: right;
      }
      th:first-child,
      td:first-child {
        text-align: left;
      }
      .goods-table th,
      .goods-table td {
        vertical-align: bottom;
      }
      .goods-table th:first-child,
      .goods-table td:first-child {
        width: 50%;
      }
      .goods-table td {
        padding: 10px 10px 4px
      }

      .shop-table td {
        vertical-align: top;
        text-align: left;
      }
      .shop-table td:first-child {
        width: 3em;
        padding-right: 0;
      }
      .welcome {
        margin: 10px;
        padding: 0 0 40px;
        text-align: center;
      }
      .sub-title {
        text-align: center;
        padding: 10px;
      }
      .payment-table td {
        vertical-align: top;
        width: 50%;
        white-space: nowrap;
      }
    </style>
    <div>
      <div class="text-center bold mb-10 logo">斯品家居</div>
      <div class="text-center bold mb-5">${shop.name}</div>
      <div class="text-center mb-5">购物小票</div>
    </div>
    <table class="goods-table">
      <thead>
        <tr>
          <th>商品</th>
          <th>单价</th>
          <th>数量</th>
        </tr>
      </thead>
      <tbody>
        ${list.join('')}
      </tbody>
    </table>
    <div class="dashed"></div>
    <table>
      <tbody>
      <tr>
        <td>合计金额</td>
        <td>￥${order.amount.toFixed(2)}</td>
      </tr>
      ${couponAmount}
      ${pointsDiscount}
      ${orderDiscountHtml}
      <tr>
        <td>应付</td>
        <td>￥${order.payableAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>实付</td>
        <td>￥${order.paidAmount.toFixed(2)}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
    <table>
      <tbody>
      <tr>
        <td>销售单号： ${order.no}</td>
      </tr>
      <tr>
        <td>下单时间： ${order.createdAt}</td>
      </tr>
      <tr>
        <td>收银员： ${order.createrName}</td>
      </tr>
      <tr>
        <td>导购员： ${order.salerName}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
    ${orderConsignee}
    <div class="sub-title">门店信息</div>
    <table class="shop-table">
      <tbody>
      <tr>
        <td>地址：</td>
        <td>${setting.shopAddress}</td>
      </tr>
      <tr>
        <td>电话：</td>
        <td>${setting.shopPhone}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
    ${paymentListContainer}
    <div class="welcome">${setting.ticketTips}</div>
  `;
}
