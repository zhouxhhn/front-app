import { action, observable } from 'mobx';
import { removeUser, saveUser } from '../user/actions';

const defaultValue = {
  user: {
    id: 0,
    name: '',
    code: '',
    token: '',
    permission: [],
    shopCode: '',
    shop: undefined,
    setting: undefined,
  },
};

class UserStore {
  @observable
  user: any = defaultValue.user;

  @action
  setUserInfo(user) {
    if (user && user.token) {
      this.user = {
        ...user,
        // permission: user.permission || defaultValue.user.permission,
      };
    } else {
      this.clearUserInfo();
    }
    saveUser(user);
  }
  @action
  clearUserInfo() {
    this.user = defaultValue.user;
    removeUser();
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }
  @action
  resetStore(key) {
    this[key] = defaultValue[key];
  }
}

const userStore = new UserStore();
export default userStore;
