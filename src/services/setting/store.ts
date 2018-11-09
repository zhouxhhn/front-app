import { action, observable } from 'mobx';

class SettingStore {
  @observable
  setting: any = {};

  @action
  setStore(key, value) {
    this[key] = value;
  }
}

const settingStore = new SettingStore();
export default settingStore;
