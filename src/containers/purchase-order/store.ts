import { action, observable, toJS } from 'mobx';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import uuid from 'uuid';
import webapi from '../../utils/webapi';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import formatDate from '../../utils/date-format';

class PurchaseOrderStore {
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
    const res = await proxy(webapi.purchase.frontShowPurchaseOrder(orderNo));
    if (isSuccess(res)) {
      const order = res.data;
      order.detailVos.map(item => {
        item.id = uuid();
        item.discount = order.discount;

        return item;
      });
      order.createdAt = formatDate(order.createdAt);

      this.resetList(order);
      this.setOrder(order);
    } else {
      Toast.fail(res.msg);
    }
  }
  @action
  resetList(order) {
    this.listStore.list = this.listStore.list.map(
      item => (item.no === order.no ? order : item)
    );
    this.listStore.setDataSource();
  }

  cancelOrder = async orderNo => {
    const res = await proxy(webapi.purchase.frontDeletePurchaseOrder(orderNo));
    if (isSuccess(res)) {
      Toast.success('订单取消成功');
      this.getOrder(orderNo);
    } else {
      Toast.fail(res.msg || '订单取消失败');
    }

    return res;
  };
  async setNote(orderNo, note) {
    const res = await proxy(
      webapi.purchase.frontUpdatePurchaseOrderNote(orderNo, { note })
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
export default PurchaseOrderStore;
