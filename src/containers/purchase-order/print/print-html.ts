/**
 * getPrintHtml
 * @export getPrintHtml
 * @param {*} order 订单
 * @param {*} { shop, agency }
 * @returns {string} html
 */
export default function getPrintHtml(order: any, { shop, agency }): string {
  const list = order.detailVos.map(item => {
    return `
    <tr>
      <td>
        <div class="bold">${item.name}</div>
        <div>${item.detailNo}</div>
      </td>
      <td>￥${item.discountAmount}</td>
      <td>x${item.total}</td>
    </tr>`;
  });

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
        font-weight: bold;
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

      .consignee-table td {
        vertical-align: top;
        text-align: left;
      }
      .consignee-table td:first-child {
        text-align: right;
        width: 5em;
        padding-right: 0;
      }
    </style>
    <div>
      <div class="text-center bold mb-10 logo">斯品家居</div>
      <div class="text-center bold mb-5">${shop.name}</div>
      <div class="text-center mb-5">采购小票</div>
    </div>
    <table class="goods-table">
      <thead>
        <tr>
          <th>商品</th>
          <th>采购价</th>
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
        <td>￥${order.amount}</td>
      </tr>
      <tr>
        <td>应付</td>
        <td>￥${order.payableAmount}</td>
      </tr>
      <tr>
        <td>实付</td>
        <td>￥${order.paidAmount}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
    <table>
      <tbody>
      <tr>
        <td>采购单号： ${order.no}</td>
      </tr>
      <tr>
        <td>下单时间： ${order.createdAt}</td>
      </tr>
      <tr>
        <td>经销商： ${agency.name}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
    <table class="consignee-table">
      <tbody>
      <tr>
        <td>收货地址：</td>
        <td>
          ${order.orderConsignee.province}${order.orderConsignee.city}${order
    .orderConsignee.district || ''}${order.orderConsignee.addr || ''}
        </td>
      </tr>
      <tr>
        <td>收货人：</td>
        <td>${order.orderConsignee.name}</td>
      </tr>
      <tr>
        <td>手机：</td>
        <td>${order.orderConsignee.mobile}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
  `;
}
