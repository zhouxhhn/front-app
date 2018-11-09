import constants from '../../../services/constants';
import { line, renderRowText, renderTwoCol } from '../../../services/sunmi';

/**
 * 输出商米打印数据
 * @export getSunmiPrintData
 * @param {*} order 退货单
 * @param {*} { shop, setting } 系统数据: 门店, 设置
 * @returns {*} 打印数据
 */
export default function getSunmiPrintData(order, { shop, setting }) {
  // 商品数据
  const orderDetailList = order.returnOrderDetailVos.map(item => {
    return {
      type: 'table',
      fontSize: 24,
      align: ['left', 'left', 'right'],
      width: [25, 15, 5],
      data: [
        [item.name, '', ''],
        [
          item.skuNo,
          `￥${item.refundedAmount && item.refundedAmount.toFixed(2)}`,
          `x${item.refundedQuantity}`,
        ],
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
      data: '退货小票',
    },
    line,
    {
      type: 'table',
      fontSize: 24,
      align: ['left', 'left', 'left'],
      width: [25, 15, 5],
      data: [['商品', '单价', '数量']],
    },
    // 商品列表
    ...orderDetailList,
    line,
    renderTwoCol(['退货数量', `${order.refundQuantity}`]),
    renderTwoCol(['退款金额', `￥${order.refundedAmount.toFixed(2)}`]),
    renderTwoCol(['退款方式', `${constants.refundType[order.refundType]}`]),
    line,
    renderRowText(`退货单号： ${order.no}`),
    renderRowText(`销售单号： ${order.salesOrderNo}`),
    renderRowText(`创建时间： ${order.createdAt}`),
    renderRowText(`操作员： ${order.createrName || '无'}`),
    line,
    renderRowText(`地址： ${setting.shopAddress}`),
    renderRowText(`电话： ${setting.shopPhone}`),
    line,
    renderRowText(`${setting.ticketTips}`, 'center'),
    {
      type: 'empty',
      data: 5,
    },
  ];
}
