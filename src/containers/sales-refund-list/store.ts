import { action, observable, toJS } from 'mobx';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import webapi from '../../utils/webapi';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import { transformRefundOrder } from './utils';
import print from './print';

class SalesOrderRefundStore {
  @observable
  order: any = { returnOrderDetailVos: [] };
  listStore: any;

  constructor(listStore) {
    this.listStore = listStore;
  }

  @action
  setOrder(order) {
    this.order = order;
  }
  async getOrder(orderNo) {
    const res = await proxy(webapi.order.frontShowReturnOrder(orderNo));
    if (isSuccess(res)) {
      const order = transformRefundOrder(res.data);
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

  auditReturnOrder = async orderNo => {
    const res = await proxy(webapi.order.frontAuditReturnOrder(orderNo));
    if (isSuccess(res)) {
      Toast.success('操作成功');
      this.getOrder(orderNo);
      this.print();
    } else {
      Toast.fail(res.msg || '操作失败');
    }

    return res;
  };

  cancelReturnOrder = async orderNo => {
    const res = await proxy(webapi.order.frontCancelReturnOrder(orderNo));
    if (isSuccess(res)) {
      Toast.success('操作成功');
      this.getOrder(orderNo);
    } else {
      Toast.fail(res.msg || '操作失败');
    }

    return res;
  };

  print = () => {
    print(toJS(this.order));
  };
}
export default SalesOrderRefundStore;
