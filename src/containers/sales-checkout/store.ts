import {
  FormKeyStore,
  FormStore,
} from '@sipin/sipin-sales-cloud-components/src/utils/form-store';
import { action, observable, toJS } from 'mobx';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';
import { transCouponList } from './utils/transform-coupon';

const formStoreKeys = {
  member: undefined,
  mobile: '',
  coupon: undefined,
  point: '',
  address: undefined,
  note: '',
};

export class Store extends FormStore {
  form: any = new FormKeyStore(formStoreKeys);

  @observable
  member: any = undefined;
  @observable
  address: any[] = [];

  @observable
  tab: string = 'member';

  setStoreData(data) {
    Object.keys(data).forEach(key => {
      this.setStore(key, data[key]);
    });
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }

  async getMember(mobile) {
    const res = await proxy(webapi.order.frontGetMemberInfo(mobile));
    if (isSuccess(res)) {
      const data = res.data;
      const address = data.addresses.map(item => ({
        id: item.addressId,
        ...item,
        name: item.consignee,
      }));
      this.setStore('address', address);
      this.setStore('member', {
        ...data,
        levelName: data && data.level && data.level.name,
        coupon: transCouponList(data.coupon),
        address,
      });
    }
  }
  exchangeCoupon = async code => {
    const {
      member: { mobile },
    } = this.form;
    const res = await proxy(webapi.order.frontBindCoupon(mobile, code));
    if (isSuccess(res)) {
      return await this.getCoupon(code);
    }
  };
  getCoupon = async code => {
    return await proxy(webapi.order.frontGetMemberCoupon(code));
  };
  @action
  setMemberCoupon(record) {
    const member = this.form.member;
    const couponList = [record, ...toJS(member.coupon)];
    member.coupon = couponList;
    this.setForm({ member });
  }
  @action
  setMemberAddress(record) {
    const address = [
      {
        ...record,
        name: record.consignee,
      },
      ...toJS(this.address),
    ];
    this.setStore('address', address);
  }

  submitOrder = async order => {
    return await proxy(webapi.order.frontCreateSalesOrder(order));
  };

  @action
  resetAll() {
    this.setForm(formStoreKeys);
    this.tab = 'member';
    this.address = [];
    this.member = undefined;
  }
}

export default new Store();
