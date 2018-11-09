import webapi from '../../utils/webapi';

// 获取支付流水列表
export const salesPaymentIndexApi = webapi.order.salesPaymentIndex1.bind(
  webapi.order
);

// 订单汇总
export const salesPaymentSumApi = webapi.order.salesPaymentSum.bind(
  webapi.order
);

// 获取订单汇总
export const getSalesPaymentSum = async (params = {}): Promise<any> => {
  const res = await webapi.order.salesPaymentSum(params);

  if (res && res.code === 0) {
    return res.data;
  }

  return {
    error: res.msg || '请求出错',
  };
};
