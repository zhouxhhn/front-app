import { action, observable, toJS } from 'mobx';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import webapi from '../../utils/webapi';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import { transformSaleOrder } from './utils';

class SalesOrderStore {
  @observable
  order: any;
  listStore: any;

  constructor(listStore) {
    this.listStore = listStore;
  }

  @action
  setOrder(order) {
    this.order = order;
  }
  async getOrder(orderNo) {
    const res = await proxy(webapi.order.detailSalesOrder(orderNo));
    if (isSuccess(res)) {
      const order = transformSaleOrder(res.data);
      this.resetList(order);
      this.setOrder(order);

      return true;
    }

    Toast.fail(res.msg);

    return false;
  }
  @action
  resetList(order) {
    this.listStore.list = this.listStore.list.map(
      item => (item.no === order.no ? order : item)
    );
    this.listStore.setDataSource();
  }

  cancelOrder = async orderNo => {
    const res = await proxy(webapi.order.cancelOrderSalesOrder(orderNo));
    if (isSuccess(res)) {
      Toast.success('订单取消成功');
      this.getOrder(orderNo);
    } else {
      Toast.fail(res.msg || '订单取消失败');
    }

    return res;
  };

  confirmCompleteOrder = async orderNo => {
    const res = await proxy(webapi.order.confirmCompleteSalesOrder(orderNo));
    if (isSuccess(res)) {
      Toast.success('订单确认完成成功');
      this.getOrder(orderNo);
    } else {
      Toast.fail(res.msg || '订单确认完成失败');
    }

    return res;
  };
  async setNote(orderNo, note) {
    const res = await proxy(
      webapi.order.editNotesSalesOrder(orderNo, { note })
    );
    if (isSuccess(res)) {
      const order = toJS(this.order);
      Toast.success('备注修改成功!');
      this.setOrder({ ...order, note });
    } else {
      Toast.fail(res.msg);
    }

    return res;
  }
}
export default SalesOrderStore;
