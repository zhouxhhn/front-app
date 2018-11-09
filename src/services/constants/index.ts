const values = {
  // 采购、销售订单状态
  ORDER_STATUS_PAY_WAIT: 0,
  ORDER_STATUS_PAY_FINAL_WAIT: 1,
  ORDER_STATUS_PAY_SUCCEED: 2,
  ORDER_STATUS_DELIVERY_WAIT: 3,
  ORDER_STATUS_DELIVERED: 4,
  ORDER_STATUS_FINISHED: 5,
  ORDER_STATUS_DELIVERED_PARTIAL: 6,
  ORDER_STATUS_FROZEN: 100,
  ORDER_STATUS_PARTIAL_REFUNDED: 180,
  ORDER_STATUS_AUDIT_WAIT: 200,
  ORDER_STATUS_REFUND_WAIT: 201,
  ORDER_STATUS_REFUNDED: 202,
  ORDER_STATUS_PAY_REFUNDING: 203,
  ORDER_STATUS_CANCELED: 300,

  // 退款方式
  REFUND_TYPE_CASH: 0,
  REFUND_TYPE_OTHER: 2,

  // 退货单状态
  REFUND_STATUS_PENDING: 1,
  REFUND_STATUS_AUDITED: 2,
  REFUND_STATUS_CANCEL: 3,

  // 商品状态
  GOODS_NOT_ENABLED: 0, // NOT_ENABLED(0, "CPZT005", "存档"),
  GOODS_ENABLED: 1, // ENABLED(1, "CPZT002", "上架"),
  GOODS_STOP_PRODUCTION: 2, // STOP_PRODUCTION(2, "CPZT001", "停产"),
  GOODS_OBSOLET: 3, // OBSOLET(3, "CPZT003", "淘汰"),
  GOODS_SAMPLE: 4, // SAMPLE(4, "CPZT004", "打样");

  GOODS_FORBID_STATUS_NOT_ENABLED: 0, // 禁用
  GOODS_FORBID_STATUS_ENABLED: 1, // 启用
};

export const orderStatus = {
  [values.ORDER_STATUS_PAY_WAIT]: '等待付款',
  [values.ORDER_STATUS_PAY_FINAL_WAIT]: '等待尾款',
  [values.ORDER_STATUS_PAY_SUCCEED]: '付款成功',
  [values.ORDER_STATUS_DELIVERY_WAIT]: '等待发货',
  [values.ORDER_STATUS_DELIVERED]: '已发货',
  [values.ORDER_STATUS_FINISHED]: '已完成',
  [values.ORDER_STATUS_DELIVERED_PARTIAL]: '部分发货',
  [values.ORDER_STATUS_FROZEN]: '已冻结',
  [values.ORDER_STATUS_PARTIAL_REFUNDED]: '部分退货退款',
  [values.ORDER_STATUS_AUDIT_WAIT]: '退货待审',
  [values.ORDER_STATUS_REFUND_WAIT]: '等待退货',
  [values.ORDER_STATUS_REFUNDED]: '已退货',
  [values.ORDER_STATUS_PAY_REFUNDING]: '退款中',
  [values.ORDER_STATUS_CANCELED]: '已取消',
};

export const refundType = {
  [values.REFUND_TYPE_CASH]: '现金',
  [values.REFUND_TYPE_OTHER]: '其它',
};

export const auditStatus = {
  [values.REFUND_STATUS_PENDING]: '待审核',
  [values.REFUND_STATUS_AUDITED]: '已审核',
  [values.REFUND_STATUS_CANCEL]: '已取消',
};

export const goodsStatus = {
  [values.GOODS_NOT_ENABLED]: '存档',
  [values.GOODS_ENABLED]: '上架',
  [values.GOODS_STOP_PRODUCTION]: '停产',
  [values.GOODS_OBSOLET]: '淘汰',
  [values.GOODS_SAMPLE]: '打样',
};

export const goodsForbidStatus = {
  [values.GOODS_FORBID_STATUS_NOT_ENABLED]: '禁用',
  [values.GOODS_FORBID_STATUS_ENABLED]: '启用',
};

export default { ...values, orderStatus, refundType, auditStatus, goodsStatus };
