import webapi from '../../utils/webapi';
import constants from '../constants';

// 获取销售商品列表
export const frontSearchAllSkuNoStockApi = async ({
  search,
  ...params
}): Promise<any> => {
  if (search) {
    params = { ...params, search, status: [] };
  } else {
    params = {
      ...params,
      status: [constants.GOODS_ENABLED, constants.GOODS_STOP_PRODUCTION],
    };
  }

  return webapi.merchandise.frontSearchAllSkuNoStock({ ...params });
};

// 获取销售订单列表
export const getIndexSalesOrder = async ({
  search,
  ...params
}): Promise<any> => {
  return webapi.order.indexSalesOrder({ no: search, ...params });
};

// 获取销售退货单列表
export const salesRefundList = async ({
  search,
  orderNo,
  ...params
}): Promise<any> => {
  if (search) {
    params = {
      returnOrderNo: search,
      ...params,
    };
  }
  if (orderNo) {
    params = {
      orderNo,
      ...params,
    };
  }

  return webapi.order.frontGetReturnOrderList(params);
};
