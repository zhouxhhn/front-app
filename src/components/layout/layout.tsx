import React, { Component } from 'react';
import { Layout as AppLayout } from '@sipin/sipin-sales-cloud-components/src/components';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import { Modal, ActionSheet } from 'antd-mobile';
import loginStore from '../../containers/login/store';
import userStore from '../../services/user/store';
import shopStore from '../../services/shop/store';
import PasswordForm from '../password-form';
import { isWeb } from '../../utils';

const menus = [
  {
    title: '首页',
    path: '/',
    key: 'index',
  },
  {
    title: '开单收银',
    path: '/sales',
    key: 'sales',
  },
  {
    title: '销售订单',
    path: '/sales-order',
    key: 'sales-order',
  },
  {
    title: '销售退货单',
    path: '/sales-refund-list',
    key: 'sales-refund',
  },
  {
    title: '采购进货',
    path: '/purchase',
    key: 'purchase',
  },
  {
    title: '采购订单',
    path: '/purchase-order',
    key: 'purchase-order',
  },
  {
    title: '查看库存',
    path: '/stock',
    key: 'stock',
  },
  {
    title: '对帐',
    path: '/statement',
    key: 'statement',
  },
  {
    title: '设置',
    path: '/setting',
    key: 'setting',
  },
  {
    title: '员工管理',
    path: '/user',
    key: 'user',
  },
  {
    title: '角色管理',
    path: '/role',
    key: 'role',
  },
];

@observer
class Layout extends Component<any> {
  async componentDidMount() {
    const res = await loginStore.checkLogin();
    if (!res) {
      this.goToLogin();
    }
  }
  logout = async () => {
    await loginStore.logout();
    this.goToLogin();
  };
  onUserNameClick = () => {
    this.showActionSheet();
  };

  showActionSheet = () => {
    const BUTTONS = ['修改密码', '退出登录', '取消'];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        // title: 'title',
        // message: '选择操作',
      },
      index => {
        switch (index) {
          case 0:
            this.passwordForm.modal.open();
            break;
          case 1:
            Modal.alert('退出登录', '确定退出经销商系统么?', [
              { text: '取消', onPress: () => {}, style: 'default' },
              { text: '确定', onPress: async () => await this.logout() },
            ]);
            break;
        }
      }
    );
  };
  goToLogin() {
    const { app } = this.props;
    if (isWeb) {
      app.push('/login');
      window.location.reload();
    } else {
      app.push('Login');
    }
  }
  passwordForm: any;
  render() {
    const { children, activeMenuKey, app } = this.props;

    return (
      <AppLayout
        menus={menus}
        activeMenuKey={activeMenuKey}
        app={app}
        user={toJS(userStore.user)}
        shop={toJS(shopStore.shop)}
        onUserNameClick={this.onUserNameClick}
      >
        {children}
        <PasswordForm ref={c => (this.passwordForm = c)} />
      </AppLayout>
    );
  }
}

export default Layout;
