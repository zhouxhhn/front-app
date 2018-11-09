import { line, renderRowText, renderTwoCol } from '../../../services/sunmi';

/**
 * 输出商米打印数据
 * @export getSunmiPrintData
 * @param {*} order 订单
 * @param {*} { shop, agency } 系统数据: 门店, 经销商
 * @returns {*} 打印数据
 */
export default function getSunmiPrintData(order, { shop, agency }) {
  // 商品数据
  const orderDetailList = order.detailVos.map(item => {
    return {
      type: 'table',
      fontSize: 24,
      align: ['left', 'left', 'right'],
      width: [25, 15, 5],
      data: [
        [item.name, '', ''],
        [item.detailNo, `￥${item.discountAmount}`, `x${item.total}`],
      ],
    };
  });

  return [
    {
      type: 'text',
      align: 'center',
      fontSize: 35,
      data: '斯品家居',
    },
    {
      type: 'empty',
      data: 1,
    },
    {
      type: 'text',
      align: 'center',
      fontSize: 24,
      data: shop.name,
    },
    {
      type: 'text',
      align: 'center',
      fontSize: 20,
      data: '采购小票',
    },
    line,
    {
      type: 'table',
      fontSize: 24,
      align: ['left', 'left', 'left'],
      width: [25, 15, 5],
      data: [['商品', '采购价', '数量']],
    },
    // 商品列表
    ...orderDetailList,
    line,
    renderTwoCol(['合计金额', `￥${order.amount}`]),
    renderTwoCol(['应付', `￥${order.payableAmount}`]),
    renderTwoCol(['实付', `￥${order.paidAmount}`]),
    line,
    renderRowText(`采购单号： ${order.no}`),
    renderRowText(`下单时间： ${order.createdAt}`),
    renderRowText(`经销商： ${agency.name}`),
    line,
    renderRowText(
      `收货地址： ${order.orderConsignee.province}${
        order.orderConsignee.city
      }${order.orderConsignee.district || ''}${order.orderConsignee.addr}`
    ),
    renderRowText(`收货人： ${order.orderConsignee.name}`),
    renderRowText(`手机： ${order.orderConsignee.mobile}`),
    line,
    {
      type: 'empty',
      data: 5,
    },
  ];
}
