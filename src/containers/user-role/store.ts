import { action, computed, observable, toJS } from 'mobx';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';

class Store {
  @observable
  userRoles: any[] = [];
  @observable
  roles: any[] = [];

  @computed
  get selectedIds() {
    return this.userRoles && this.userRoles.length
      ? toJS(this.userRoles).map(item => item.id)
      : [];
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }

  reset = () => {
    this.setStore('userRoles', []);
  };

  // 获取角色列表
  salesFrontRolesIndex = async () => {
    const res = await proxy(
      webapi.salesMember.salesFrontRolesIndex({ page: 1, size: 999 })
    );
    if (isSuccess(res)) {
      const data = res.data.records;
      this.setStore('roles', data);
    }
  };
  // 获取员工
  salesFrontUserSearchUser = async id => {
    const res = await proxy(webapi.salesMember.salesFrontUserSearchUser(id));

    if (isSuccess(res)) {
      this.setStore(
        'userRoles',
        res.data.roles.map(item => ({ ...item, id: Number(item.id) }))
      );
    }
  };
  // 绑定角色
  salesFrontUserSetRole = async userId => {
    const res = await proxy(
      webapi.salesMember.salesFrontUserSetRole(userId, {
        roles: this.selectedIds,
      })
    );

    if (isSuccess(res)) {
      return true;
    }
  };
}
const store = new Store();
export default store;
