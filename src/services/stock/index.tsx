import webapi from '../../utils/webapi';

// 获取库存商品列表
export const frontSearchSkuWarehouseStockApi = webapi.merchandise.frontSearchSkuWarehouseStock.bind(
  webapi.merchandise
);
