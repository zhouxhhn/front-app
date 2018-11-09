import { action, extendObservable, observable, toJS } from 'mobx';
import objectPath from 'object-path';

export class FormKeyStore {
  @observable
  default: string = '';
  @observable
  fieldErrors: any = {};
  @observable
  loadingState: number = 0;
  constructor(item: any) {
    extendObservable(this, item);
  }
}

const formStoreKeys = {
  id: '',
};

export class FormStore {
  form: FormKeyStore = new FormKeyStore(formStoreKeys);
  @action('处理表单')
  setForm(data, formKey: string = 'form') {
    const keys = formKey.split('.');
    if (formKey && keys.length > 1) {
      const prev = objectPath.get(this, formKey);
      const jsPrev = toJS(prev);
      const next =
        typeof jsPrev === 'object' && Array.isArray(jsPrev) === false
          ? { ...prev, ...data }
          : data;
      objectPath.set(this, formKey, next);
    } else {
      Object.assign(this[formKey], data);
    }
  }
  @action('处理表单错误提示')
  setFieldErrors(errors, formKey: string = 'form') {
    objectPath.set(this, formKey + '.fieldErrors', errors, false);
  }
  @action('设置表单loading状态')
  setFormLoadingStatus(value: boolean) {
    if (value) {
      this.form.loadingState++;
    } else {
      this.form.loadingState--;
    }
  }
}
