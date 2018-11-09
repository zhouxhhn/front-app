import webapi from '../../utils/webapi';
import constants from '../constants';

// 获取采购商品列表
export const frontSearchAllSkuApi = async ({
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

  return webapi.merchandise.frontSearchAllSku({ ...params });
};

// 获取采购订单列表
export const frontPurchaseOrderListApi = async ({
  search,
  ...params
}): Promise<any> => {
  if (search) {
    params = {
      orderNo: search,
      ...params,
    };
  }

  return webapi.purchase.frontPurchaseOrderList(params);
};
