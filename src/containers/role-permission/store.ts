import { action, computed, observable } from 'mobx';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';

class Store {
  @observable
  permissions: any[] = [];
  @observable
  tab: string = '';
  @observable
  tabs: any[] = [];

  @computed
  get allSelected() {
    return (
      this.permissions.length &&
      !this.permissions.filter(item => item.status === 0).length
    );
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }

  reset = () => {
    this.setStore('permissions', []);
  };

  // 获取权限组
  salesPermissionGroupIndexFrontGroup = async () => {
    const res = await proxy(
      webapi.salesMember.salesPermissionGroupIndexFrontGroup()
    );
    if (isSuccess(res)) {
      const data = res.data.records;
      if (data.length) {
        this.setStore(
          'tabs',
          data.map(item => ({
            title: item.name,
            key: String(item.id),
          }))
        );

        return data;
      }
    }
  };
  // 获取权限
  salesPermissionGroupIndexAction = async (roleId, groupId) => {
    const res = await proxy(
      webapi.salesMember.salesPermissionGroupIndexAction(roleId, groupId)
    );

    if (isSuccess(res)) {
      const data = res.data.records;
      if (data.length) {
        this.setStore('tab', String(groupId));
        this.setStore('permissions', data);
      }
    }
  };
  // 设置权限
  salesFrontPermissionRoleSetRolePermission = async (
    roleId,
    permissionActionIds
  ) => {
    return await proxy(
      webapi.salesMember.salesFrontPermissionRoleSetRolePermission(roleId, {
        groupId: +this.tab,
        permissionActionIds,
      })
    );
  };
}
const store = new Store();
export default store;
