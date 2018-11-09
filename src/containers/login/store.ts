import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { FormStore } from '@sipin/sipin-sales-cloud-components/src/utils/form-store';
import { toJS } from 'mobx';
import agencyStore from '../../services/agency/store';
import lodopStore from '../../services/lodop/store';
import settingStore from '../../services/setting/store';
import shopStore from '../../services/shop/store';
import { getUser } from '../../services/user/actions';
import userStore from '../../services/user/store';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';
import { PRINTER_TYPE_AO } from '../setting/constant';

export class Store extends FormStore {
  login = async data => {
    const { shopCode, userCode, password } = data;
    const params: any = {
      shopcode: shopCode[0],
      userCode,
      password,
    };

    const res = await proxy(webapi.salesMember.salesFrontUserLogin(params));
    if (isSuccess(res)) {
      // 门店
      const shops = toJS(shopStore.shops).filter(
        item => item.code === shopCode[0]
      );
      const shop = shops.length && shops[0];

      // 用户
      const data = res.data;
      const printSetting = data.printSetting || {};
      const user = {
        ...data.salesUser,
        shop,
        setting: {
          ...printSetting,
          shopCode: shopCode[0],
        },
        token: data.token,
      };

      shopStore.setStore('shop', user.shop);
      settingStore.setStore('setting', user.setting);
      userStore.setUserInfo(user);

      await this.afterLogin();

      return true;
    } else {
      Toast.fail(res.msg || '失败');

      return false;
    }
  };

  afterLogin = async () => {
    await shopStore.getSellers();
    await agencyStore.getAgency();
  };

  checkLogin = async () => {
    const user = await getUser();
    const { setting } = user;
    if (user && user.token) {
      settingStore.setStore('setting', user.setting);
      if (
        setting &&
        setting.printerType === PRINTER_TYPE_AO &&
        !lodopStore.CLodop &&
        setting.printerIp
      ) {
        // 如果没有CLodap, 加载打印服务 JS
        lodopStore.fetchJS(setting.printerIp);
      }

      if (!userStore.user.token || userStore.user.token !== user.token) {
        shopStore.setStore('shop', user.shop);
        userStore.setUserInfo(user);

        await this.afterLogin();
      }

      return true;
    } else {
      return false;
    }
  };

  logout = async () => {
    userStore.clearUserInfo();
    const res: any = await proxy(webapi.salesMember.salesUserUserLogout());
    if (isSuccess(res)) {
      Toast.success('退出登录成功!');

      return true;
    } else {
      return false;
    }
  };
}

const loginStore = new Store();
export default loginStore;
