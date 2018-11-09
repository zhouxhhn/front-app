import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { action, observable } from 'mobx';
import settingStore from '../setting/store';
import initLodop from './init';

class LodopStore {
  @observable
  printerIndex: string = '';
  @observable
  printerOptions: any[] = [];
  CLodop: any;
  async fetchJS(ip) {
    try {
      const { CLodop, printerOptions, error } = await initLodop(
        ip,
        `CLodop${Date.now()}`
      );
      this.CLodop = CLodop;
      this.setStore('printerOptions', printerOptions);

      if (error) {
        return { error };
      }

      return {};
    } catch (err) {
      console.error(err);

      return { error: err };
    }
  }
  @action
  setStore(key, value) {
    this[key] = value;
  }
  init({ name = '', printerIndex }) {
    const CLodop = this.CLodop;
    if (CLodop) {
      CLodop.PRINT_INIT(name || Date.now());
      CLodop.SET_PRINTER_INDEXA(printerIndex);
      CLodop.SET_PRINT_PAGESIZE(3, 720, 0, '');
    } else {
      Toast.fail('打印服务不存在, 请检查打印设置!');
    }
  }
  print(html) {
    const { setting } = settingStore;
    const { CLodop } = this;

    if (CLodop) {
      this.init({ printerIndex: setting.printer });
      CLodop.ADD_PRINT_HTM(0, 0, '100%', '100%', html);
      // CLodop.PREVIEW();
      CLodop.PRINT();
    } else {
      Toast.fail('打印服务失败.');
    }
  }
}
const lodopStore = new LodopStore();
export default lodopStore;
