import uuid from 'uuid';
import defaultPic from '../../static/images/default.png';
import formatDate from '../../utils/date-format';
/**
 * 格式化order数据 transformSaleOrder
 * @param {*} order order
 * @returns {*} order
 */
export function transformSaleOrder(order): any {
  order.orderDetailList.map(item => {
    item.id = uuid();
    item.discount = order.discount;
    item.imgPath = item.imgPath || defaultPic;

    return item;
  });
  order.paymentResponseList.map(item => {
    item.paidAt = formatDate(order.paidAt);

    return item;
  });
  if (!order.paidAmount) {
    order.paidAmount = 0;
  }
  order.createdAt = formatDate(order.createdAt);

  return order;
}
