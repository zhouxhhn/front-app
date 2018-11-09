import {
  FormKeyStore,
  FormStore,
} from '@sipin/sipin-sales-cloud-components/src/utils/form-store';
import proxy from '../../../../services/utils/proxy';
import webapi from '../../../../utils/webapi';

const formStoreKeys = {
  id: '',
  name: '',
  status: 0,
};

class Store extends FormStore {
  form: FormKeyStore = new FormKeyStore(formStoreKeys);

  submit = async ({ id, ...params }: any) => {
    return await proxy(
      id !== ''
        ? webapi.salesMember.salesFrontRolesUpdate(id, params)
        : webapi.salesMember.salesFrontRolesAdd(params)
    );
  };

  reset = () => {
    this.setForm(formStoreKeys);
  };
}
const store = new Store();
export default store;
