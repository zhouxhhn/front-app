import math from '@sipin/basic-libs/lib/js/math';
import {
  line,
  renderRowText,
  renderTwoCol,
  renderTwoColMultiRow,
} from '../../../services/sunmi';

/**
 * 输出商米打印数据
 * @export getSunmiPrintData
 * @param {*} order 订单
 * @param {*} { shop, setting } 系统数据: 门店, 设置
 * @returns {*} 打印数据
 */
export default function getSunmiPrintData(order, { shop, setting }) {
  // 商品数据
  const orderDetailList = order.orderDetailList.map(item => {
    return {
      type: 'table',
      fontSize: 24,
      align: ['left', 'left', 'right'],
      width: [25, 15, 5],
      data: [
        [item.name, '', ''],
        [
          item.skuNo,
          `￥${item.discountAmount && item.discountAmount.toFixed(2)}`,
          `x${item.quantity}`,
        ],
      ],
    };
  });

  // 优惠券
  const couponAmount =
    order.couponAmount > 0
      ? [renderTwoCol(['优惠券', `-￥${order.couponAmount}`])]
      : [];
  // 积分
  const pointsDiscount =
    order.pointsDiscount > 0
      ? [renderTwoCol(['积分', `-￥${order.pointsDiscount}`])]
      : [];

  // 整单优惠
  const orderDiscount = math.Sub(
    order.originalPayableAmount,
    order.payableAmount,
    2
  );
  const orderDiscountPrint =
    +orderDiscount > 0
      ? [renderTwoCol(['整单优惠', `-￥${orderDiscount}`])]
      : [];

  // 找零
  const givenChange =
    order.payableAmount < order.paidAmount
      ? math.Sub(order.paidAmount, order.payableAmount, 2)
      : '0.00';
  const givenChangePrint = [renderTwoCol(['找零', `￥${givenChange}`])];

  // 支付明细
  const paymentList = [];
  order.paymentResponseList.map(item => {
    paymentList.push([
      `￥${item.price && item.price.toFixed(2)}`,
      `${item.paymentMethod}`,
    ]);
    paymentList.push(['', `${item.paidAt}`]);
  });
  const paymentListPrint = paymentList.length
    ? [renderTwoColMultiRow(paymentList)]
    : [];

  // 收货信息
  const orderConsignee = order.orderConsignee
    ? [
        renderRowText('收货信息', 'center'),
        renderRowText(`收货人： ${order.orderConsignee.name}`),
        renderRowText(`联系电话： ${order.orderConsignee.mobile}`),
        renderRowText(`收货地址： ${order.orderConsignee.addr}`),
        line,
      ]
    : [];

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
      data: '购物小票',
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
    renderTwoCol(['合计金额', `￥${order.amount.toFixed(2)}`]),
    ...couponAmount,
    ...pointsDiscount,
    ...orderDiscountPrint,
    renderTwoCol(['应付', `￥${order.payableAmount.toFixed(2)}`]),
    renderTwoCol(['实付', `￥${order.paidAmount.toFixed(2)}`]),
    line,
    renderRowText(`销售单号： ${order.no}`),
    renderRowText(`下单时间： ${order.createdAt}`),
    renderRowText(`收银员： ${order.createrName}`),
    renderRowText(`导购员： ${order.salerName}`),
    line,
    ...orderConsignee,
    renderRowText('门店信息', 'center'),
    renderRowText(`地址： ${setting.shopAddress}`),
    renderRowText(`电话： ${setting.shopPhone}`),
    line,
    renderRowText('支付记录', 'center'),
    ...paymentListPrint,
    ...givenChangePrint,
    line,
    renderRowText(`${setting.ticketTips}`, 'center'),
    {
      type: 'empty',
      data: 5,
    },
  ];
}
