import { action, observable } from 'mobx';
import proxy from '../../services/utils/proxy';
import { FormKeyStore, FormStore } from '../../utils/form-store';
import webapi from '../../utils/webapi';

const formStoreKeys = {
  posIp: '',
  posType: [],
  printer: undefined,
  printerIp: '',
  printerType: [],
  shopAddress: '',
  shopPhone: '',
  ticketTips: '',
  shopCode: '',
};

class Store extends FormStore {
  form: any = new FormKeyStore(formStoreKeys);
  @observable
  tab: number = 0;

  @action
  setTab(value) {
    this.tab = value;
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }

  submit = async (shopCode, data) => {
    const {
      posIp,
      posType,
      printer,
      printerIp,
      printerType,
      shopAddress,
      shopPhone,
      ticketTips,
    } = data;

    try {
      const settings = {
        posIp,
        posType: posType && posType.length ? posType[0] : '',
        printer,
        printerIp,
        printerType: printerType && printerType.length ? printerType[0] : '',
        shopAddress,
        shopPhone,
        ticketTips,
      };
      const res = await proxy(
        webapi.salesMember.printSettingSalesOrder(shopCode, settings)
      );

      return res;
    } catch (err) {
      console.error(err);

      return err;
    }
  };
}
const store = new Store();
export default store;
