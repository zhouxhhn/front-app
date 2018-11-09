import constants from '../../../services/constants';

/**
 * getPrintHtml
 * @export getPrintHtml
 * @param {*} order 退货单
 * @param {*} { shop, agency }
 * @returns {string} html
 */
export default function getPrintHtml(order: any, { setting, shop }): string {
  const list = order.returnOrderDetailVos.map(item => {
    return `
    <tr>
      <td>
        <div class="bold">${item.name}</div>
        <div>${item.skuNo}</div>
      </td>
      <td>x${item.refundedQuantity}</td>
      <td>￥${item.refundedAmount && item.refundedAmount.toFixed(2)}</td>
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
      .payment-title {
        text-align: center;
        padding: 10px;
      }
      .payment-table td {
        vertical-align: top;
        width: 50%;
      }
    </style>
    <div>
      <div class="text-center bold mb-10 logo">斯品家居</div>
      <div class="text-center bold mb-5">${shop.name}</div>
      <div class="text-center mb-5">退货小票</div>
    </div>
    <table class="goods-table">
      <thead>
        <tr>
          <th>商品</th>
          <th>数量</th>
          <th>金额</th>
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
        <td>退货数量</td>
        <td>${order.refundQuantity}</td>
      </tr>
      <tr>
        <td>退款金额</td>
        <td>￥${order.refundedAmount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>退款方式</td>
        <td>${constants.refundType[order.refundType]}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
    <table>
      <tbody>
      <tr>
        <td>退货单号： ${order.no}</td>
      </tr>
      <tr>
        <td>销售单号： ${order.salesOrderNo}</td>
      </tr>
      <tr>
        <td>创建时间： ${order.createdAt}</td>
      </tr>
      <tr>
        <td>操作员： ${order.createrName || ''}</td>
      </tr>
      </tbody>
    </table>
    <div class="dashed"></div>
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
    <div class="welcome">${setting.ticketTips}</div>
  `;
}
