import uuid from 'uuid';
/**
 * 格式化order数据 transformRefundOrder
 * @param {*} order order
 * @returns {*} order
 */
export function transformRefundOrder(order): any {
  order.returnOrderDetailVos.forEach(item => {
    item.id = uuid();
  });

  order.refundQuantity = order.returnOrderDetailVos.reduce(
    (acc, x) => (acc += x.refundedQuantity),
    0
  );

  return order;
}
