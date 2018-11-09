import formatDate from '../../../utils/date-format';

/**
 * getPrintHtml
 * @export getPrintHtml
 * @param {*} { shop, agency }
 * @param {*} title 标题
 * @param {*} activeIndex activeIndex
 * @param {*} data data
 * @returns {string} html
 */
export default function getPrintHtml(
  { shop },
  { title = '', activeIndex, data }
): string {
  let listA = [];
  let listB = [];
  let listC = [];

  if (activeIndex === 0) {
    listA = data.receivePaymentList.map(item => {
      return `
      <tr>
        <td>
        ${item.type}:￥${item.price.toFixed(2)}
        </td>
        <td>${item.total}笔</td>
      </tr>`;
    });

    listB = data.backPaymentList.map(item => {
      return `
      <tr>
        <td>
        ${item.type}:￥${item.price.toFixed(2)}
        </td>
        <td>${item.total}笔</td>
      </tr>`;
    });
  } else {
    listC = data.dataSource.map(item => {
      return `
      <tr>
        <td>
        ￥${(item.realReceivePrice || 0).toFixed(2)}
        </td>
        <td>${item.exchangeMode}</td>
      </tr>
      <tr>
        <td>
        </td>
        <td>${formatDate(item.paidAt)}</td>
      </tr>`;
    });
  }

  const renderListA =
    listA.length && activeIndex === 0
      ? `
    <table class="goods-table">
      <thead>
        <tr>
          <th>收款</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${listA.join('')}
      </tbody>
    </table>
  `
      : '';

  const renderListB =
    listB.length && activeIndex === 0
      ? `
    <table class="goods-table">
      <thead>
        <tr>
          <th>退款</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${listB.join('')}
      </tbody>
    </table>
  `
      : '';

  const renderListC =
    listC.length && activeIndex === 1
      ? `
    <table class="goods-table">
      <tbody>
        ${listC.join('')}
      </tbody>
    </table> 
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
      <div class="text-center mb-5">${title}</div>
    </div>
    
    ${renderListA}
    ${renderListB}
    ${renderListC}
    <div class="dashed"></div>
    <table>
      <tbody>
      <tr>
        <td>合计：</td>
        <td>共${data.totalCount}笔，￥${data.totalPrice}</td>
      </tr>
      <tr>
        <td>日期：</td>
        <td>${formatDate(new Date())}</td>
      </tr>
      </tbody>
    </table>
  `;
}
