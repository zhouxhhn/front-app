import memoized from '@sipin/basic-libs/lib/funtional/memoized';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  FormKeyStore,
  FormStore,
} from '@sipin/sipin-sales-cloud-components/src/utils/form-store';
import isSuccess from '../../../../services/utils/is-success';
import proxy from '../../../../services/utils/proxy';
import webapi from '../../../../utils/webapi';

/**
 * @param {*} data data
 * @returns {*} ret
 */
export function transData(data): any {
  return data.map(d => ({
    ...d,
    label: d.name,
    value: d.id,
    children: d.children && transData(d.children),
  }));
}

const regionIndex = memoized(
  webapi.salesMember.regionIndex.bind(webapi.salesMember)
);

const formStoreKeys = {
  id: '',
  consignee: '',
  mobile: '',
  code: [],
  address: '',
};

class Store extends FormStore {
  form: FormKeyStore = new FormKeyStore(formStoreKeys);
  getRegion = async () => {
    const res = await regionIndex();
    if (isSuccess(res)) {
      return transData(res.data);
    } else {
      Toast.fail('获取地区数据出错');
      console.error('获取地区数据出错');

      return [];
    }
  };

  submit = async ({ consignee, address, mobile, code }) => {
    const [provinceCode, cityCode, districtCode] = code;
    const params: any = {
      address,
      cellphone: mobile,
      cityCode,
      defaultAddress: 0,
      districtCode,
      provinceCode,
      receiverName: consignee,
    };

    return await proxy(
      webapi.salesMember.salesAgencyDeliveryFrontAddAddress(params)
    );
  };
  reset() {
    this.setForm(formStoreKeys);
  }
}
const store = new Store();
export default store;
