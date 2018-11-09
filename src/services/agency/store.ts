import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { action, observable } from 'mobx';
import webapi from '../../utils/webapi';
import isSuccess from '../utils/is-success';
import proxy from '../utils/proxy';

class AgencyStore {
  @observable
  agency: any = {};

  @action
  setStore(key, value) {
    this[key] = value;
  }
  async getAgency() {
    const res = await proxy(webapi.salesMember.salesFrontGetAgencyInfo());
    if (isSuccess(res)) {
      this.setStore('agency', res.data);
    } else {
      Toast.fail(res.msg);
    }
  }
}

const agencyStore = new AgencyStore();
export default agencyStore;
