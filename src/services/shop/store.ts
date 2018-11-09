import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { action, observable } from 'mobx';
import webapi from '../../utils/webapi';
import isSuccess from '../utils/is-success';
import proxy from '../utils/proxy';

class ShopStore {
  @observable
  shop: any = {};
  @observable
  shops: any[] = [];
  @observable
  sellers: any[] = [];

  @action
  setStore(key, value) {
    this[key] = value;
  }
  async getShops() {
    const res = await proxy(webapi.salesMember.salesFrontSearchShop());
    if (isSuccess(res)) {
      const data = res.data.records.map(item => ({
        ...item,
        label: item.name,
        value: item.code,
      }));
      this.setStore('shops', data);

      return data;
    } else {
      Toast.fail(res.msg);

      return [];
    }
  }

  getSellers = async () => {
    const res = await proxy(webapi.salesMember.salesFrontIndexUser());

    if (isSuccess(res)) {
      const data = res.data.records.map(item => ({
        ...item,
        value: item.id,
        label: item.name,
      }));
      this.setStore('sellers', [{ value: '', label: '无' }, ...data]);
    } else {
      Toast.fail(res.msg);
    }
  };
}

const shopStore = new ShopStore();
export default shopStore;
