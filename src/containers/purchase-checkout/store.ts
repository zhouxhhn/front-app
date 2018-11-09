import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  FormKeyStore,
  FormStore,
} from '@sipin/sipin-sales-cloud-components/src/utils/form-store';
import { action, observable } from 'mobx';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';

const formStoreKeys = {
  address: undefined,
  note: '',
};

export class Store extends FormStore {
  form: any = new FormKeyStore(formStoreKeys);

  @observable
  address: any[] = [];

  @observable
  tab: string = 'address';

  setStoreData(data) {
    Object.keys(data).forEach(key => {
      this.setStore(key, data[key]);
    });
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }

  async getAddress() {
    const res = await proxy(
      webapi.salesMember.salesAgencyDeliveryFrontIndex({ page: 1, size: 99 })
    );
    if (isSuccess(res)) {
      const data = res.data.records;
      let defaultAddress;
      const address = data.map((item, i) => {
        item = this.transformAddress(item);
        // 先取第一个地址
        if (i === 0) {
          defaultAddress = item;
        }
        // 如果有默认地址则取默认地址
        if (item.isDefault === '1') {
          defaultAddress = item;
        }

        return item;
      });
      // 第一次获取到地址列表才设置地址
      if (!this.address.length && address.length) {
        this.setForm({ address: defaultAddress });
      }
      this.setStore('address', address);
    }
  }
  transformAddress = ({
    id,
    receiverName,
    cellphone,
    fullAddress,
    address,
    cityName,
    districtName,
    provinceName,
    defaultAddress,
  }) => ({
    id,
    consignee: receiverName,
    name: receiverName,
    mobile: cellphone,
    address: fullAddress,
    isDefault: defaultAddress,
    form: {
      address: address,
      cellphone,
      city: cityName,
      district: districtName,
      province: provinceName,
      receiverName,
    },
  });

  submitOrder = async order => {
    const tokenRes = await proxy(webapi.purchase.frontGetToken());
    if (isSuccess(tokenRes)) {
      return await proxy(
        webapi.purchase.frontCreatePurchaseOrder({
          ...order,
          crsfToken: tokenRes.data,
        })
      );
    }
  };

  pay = async order => {
    const res = await proxy(
      webapi.purchase.frontPurchasePaymentAffirm({ purchaseOrderNo: order.no })
    );

    if (isSuccess(res)) {
      Toast.success('付款成功!');
    } else {
      Toast.fail(res.msg || '付款失败!');
    }

    return res;
  };

  @action
  resetAll() {
    this.setForm({ note: '' });
    this.tab = 'address';
  }
}

export default new Store();
