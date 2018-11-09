import {
  FormKeyStore,
  FormStore,
} from '@sipin/sipin-sales-cloud-components/src/utils/form-store';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';

const formStoreKeys = {
  oldPassword: '',
  newPassword: '',
  renewPassword: '',
};

class Store extends FormStore {
  form: FormKeyStore = new FormKeyStore(formStoreKeys);

  submit = async params => {
    return await proxy(webapi.salesMember.salesFrontUserEditUserPwd(params));
  };

  reset = () => {
    this.setForm(formStoreKeys);
  };
}
const store = new Store();
export default store;
