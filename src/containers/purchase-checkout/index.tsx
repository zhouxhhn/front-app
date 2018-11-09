import * as React from 'react';
import {
  Flex,
  Tabs,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import {
  NotePanel,
  TotalPanel,
  AddressPanel,
} from '@sipin/sipin-sales-cloud-components/src/components/checkout';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import math from '@sipin/basic-libs/lib/js/math';
import { Modal } from 'antd-mobile';
import styled from 'styled-components/native';
import CheckoutForm from './form';
import store from './store';
import cartStore from '../purchase/store';
import isSuccess from '../../services/utils/is-success';
import { AddressForm, addressStore } from './components/address-form';
import { LeftBlock, RightBlock, CenterBlock } from '../sales-payment/blocks';
import { MainBlock } from '../../components/block';
import purchasePayment from './utils/payment';

const TabView = styled.View`
  height: 50;
  width: 100%;
`;

@observer
export class Checkout extends React.Component<any> {
  async componentDidMount() {
    const { goods } = cartStore;
    if (!goods || !goods.length) {
      this.onGoBack();
    } else {
      await store.getAddress();
    }
  }
  onGoBack = () => {
    const { app } = this.props;
    app.push('/purchase');
  };
  onConfirm = () => {
    const form = this.form;

    form.validateFields({ force: true }, async errors => {
      const hasErrors = !!errors;
      if (hasErrors) {
        console.error(errors);

        return;
      }
      const data = form.getFieldsValue();

      const addressVo = data.address.form;

      const orderSkuDetails = toJS(cartStore.goods).map(item => {
        return {
          quantity: item.quantity,
          skuNo: item.number,
          skuSn: item.sku,
          note: '',
        };
      });

      if (!orderSkuDetails.length) {
        Toast.fail('购物车为空, 不能提交订单!');

        return false;
      }

      const orderData = {
        note: data.note,
        details: orderSkuDetails,
        addressVo,
      };

      const modal = Modal.alert('提交订单', '订单正在处理中...', []);
      try {
        const res = await store.submitOrder(orderData);
        modal.close();
        if (isSuccess(res)) {
          Toast.success('订单提交成功!');
          const order = res.data;
          if (order) {
            purchasePayment(
              order,
              () => this.afterSubmit(order.no),
              () => this.afterSubmit(order.no)
            );
          }
        }
      } catch (err) {
        console.error(err);
        modal.close();
      }
    });
  };
  afterSubmit = no => {
    const { app } = this.props;
    this.emptyCart();
    store.resetAll();
    app.push(`/purchase-order/${no}`);
  };
  emptyCart = () => {
    cartStore.emptyCart();
  };
  onChangeTab = tab => {
    store.setStore('tab', tab.key);
  };

  setAddress = data => {
    const { address: addressList } = store;
    const address = store.transformAddress(data);

    store.setStore('address', [address, ...toJS(addressList)]);
    store.setForm({ address });
  };
  renderTabs = () => {
    const tabs = [
      { title: '收货地址', key: 'address' },
      { title: '备注', key: 'note' },
    ];

    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <TabView>
          <Tabs
            tabs={tabs}
            page={store.tab}
            onTabClick={this.onChangeTab}
            animated={false}
            swipeable={false}
          />
        </TabView>
        <Flex.Item style={{ width: '100%' }}>
          {this.renderTabConetnt()}
        </Flex.Item>
      </Flex>
    );
  };
  renderTabConetnt = () => {
    const {
      form: { address, note },
      address: addressList,
    } = store;

    const addressPanel = (
      <AddressPanel
        key="address"
        data={toJS(addressList) || []}
        value={toJS(address)}
        onChange={value => store.setForm({ address: value })}
      >
        <AddressForm store={addressStore} cb={this.setAddress} />
      </AddressPanel>
    );
    const notePanel = (
      <NotePanel
        key="note"
        onChange={value => store.setForm({ note: value })}
        value={note}
      />
    );

    switch (store.tab) {
      case 'address':
        return addressPanel;
      case 'note':
        return notePanel;
    }

    // return [addressPanel, notePanel];
  };
  renderCenter = () => {
    return <CenterBlock>{this.renderTabs()}</CenterBlock>;
  };
  renderRight = () => {
    const { price, quantity } = cartStore;
    const {
      form: { point },
    } = store;

    const pointPrice = math.Div(point || 0, 100, 2);
    let total = math.Sub(price, pointPrice, 2);
    if (+total < 0) {
      total = '0.00';
    }

    const data: any = [
      {
        label: '合计金额:',
        value: `¥${price}`,
      },
      {
        label: '合计数量:',
        value: quantity,
      },
    ].filter(Boolean);

    return (
      <RightBlock>
        <TotalPanel
          data={data}
          onGoBack={this.onGoBack}
          onConfirm={this.onConfirm}
          confirmText="确认付款"
        />
      </RightBlock>
    );
  };
  form: any;
  render() {
    const { goods } = cartStore;
    Object.keys(toJS(store.form)).forEach(item => item);

    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          <LeftBlock>
            <CheckoutForm
              store={store}
              cartStore={cartStore}
              goods={toJS(goods)}
              activeKey={store.tab}
              onChangeTab={tab => {
                store.setStore('tab', tab);
              }}
              wrappedComponentRef={c => c && (this.form = c.props.form)}
            />
          </LeftBlock>
          {this.renderCenter()}
          {this.renderRight()}
        </Flex>
      </MainBlock>
    );
  }
}

export default Checkout;
