import * as React from 'react';
import uuid from 'uuid';
import {
  Flex,
  Tabs,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import {
  NotePanel,
  TotalPanel,
  MemberPanel,
  CouponPanel,
  AddressPanel,
} from '@sipin/sipin-sales-cloud-components/src/components/checkout';
import styled from 'styled-components/native';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import math from '@sipin/basic-libs/lib/js/math';
import { Modal } from 'antd-mobile';
import CheckoutForm from './form';
import store from './store';
import cartStore from '../sales/store';
import getCouponPrice from './utils/get-coupon-price';
import { sortCoupon } from './utils/sort-coupon';
import checkCoupon from './utils/check-coupon';
import isSuccess from '../../services/utils/is-success';
import { transCouponList } from './utils/transform-coupon';
import { AddressForm, addressStore } from './components/address-form';
import { LeftBlock, RightBlock, CenterBlock } from '../sales-payment/blocks';
import { MainBlock } from '../../components/block';

const EmptyPanel = styled.Text`
  padding-top: 20;
  padding-left: 20;
  padding-right: 20;
  text-align: center;
`;

const TabView = styled.View`
  height: 50;
  width: 100%;
`;

@observer
export class Checkout extends React.Component<any> {
  componentDidMount() {
    const { goods } = cartStore;
    if (!goods || !goods.length) {
      this.onGoBack();
    }
    store.setForm({
      coupon: undefined,
      point: '',
      address: undefined,
      note: '',
    });
  }
  onGoBack = () => {
    const { app } = this.props;
    app.push('/sales');
  };
  onConfirm = () => {
    const { app } = this.props;
    const form = this.form;
    const {
      form: { member },
    } = store;

    form.validateFields({ force: true }, async errors => {
      const hasErrors = !!errors;
      if (hasErrors) {
        console.error(errors);

        return;
      }
      const data = form.getFieldsValue();

      const dataAddr = data.address;
      let address: any;
      // cartStore.needDelivery
      if (dataAddr) {
        address = {
          // ...dataAddr,
          addr: dataAddr.address,
          mobile: dataAddr.mobile,
          name: dataAddr.consignee,
          province: dataAddr.province,
          city: dataAddr.city,
          district: dataAddr.district,
        };
      }

      const couponCode = data.coupon && data.coupon.code;

      const orderSkuDetails = toJS(cartStore.goods).map(item => {
        return {
          amount: item.price,
          isGift: item.gift,
          isPickup: item.pickup,
          isSample: false,
          quantity: item.quantity,
          skuNo: item.number,
          skuSn: item.sku,
        };
      });

      if (!orderSkuDetails.length) {
        Toast.fail('购物车为空, 不能提交订单!');

        return false;
      }

      let orderData: any = {
        note: data.note,
        orderSkuDetails,
        point: 0, // 这个字段没有的时候需要传0
        sallerId:
          cartStore.sellerId && cartStore.sellerId.length
            ? cartStore.sellerId[0]
            : '',
        sessionKey: uuid(),
      };
      if (address) {
        orderData.address = address;
      }
      if (member) {
        orderData = {
          ...orderData,
          couponCode,
          mobile: member.mobile,
          point: data.point || 0,
        };
      }

      const modal = Modal.alert('提交订单', '订单正在处理中...', []);
      try {
        const res = await store.submitOrder(orderData);
        this.emptyCart();
        modal.close();
        store.resetAll();
        if (isSuccess(res)) {
          Toast.success('订单提交成功!');
        }
        app.push(`/payment/${res.data.no}`);
      } catch (err) {
        console.error(err);
        modal.close();
      }
    });
  };
  emptyCart = () => {
    cartStore.emptyCart();
  };
  onChangeTab = tab => {
    store.setStore('tab', tab.key);
  };
  onSearchMember = async mobile => {
    if (mobile && mobile.length === 11) {
      await store.getMember(mobile);
    } else {
      Toast.fail('请输入正确的手机号码');
    }
  };

  onExchangeCoupon = async (couponCode, clear) => {
    const { goods } = cartStore;

    if (couponCode) {
      const res = await store.exchangeCoupon(couponCode);
      if (isSuccess(res)) {
        Toast.success('优惠券兑换成功!');
        const coupon = transCouponList([res.data])[0];
        store.setMemberCoupon(coupon);
        if (checkCoupon({ coupon, goods })) {
          store.setForm({ coupon });
        }
        // 清空输入框
        clear();
      } else {
        Toast.fail(res.msg || '优惠券兑换失败!');
      }
    } else {
      Toast.fail('请输入兑换码!');
    }
  };

  setAddress = data => {
    const id = uuid();
    const address = {
      id,
      addressId: id,
      address: `${data.province.name}${data.city.name}${data.district.name}${
        data.address
      }`,
      consignee: data.consignee,
      mobile: data.mobile,
      is_default: 0,
      province: data.province.name,
      city: data.city.name,
      district: data.district.name,
      addr: data.address,
    };

    store.setMemberAddress(address);
    store.setForm({ address });
  };
  renderTabs = () => {
    const tabs = [
      { title: '会员信息', key: 'member' },
      { title: '优惠券列表', key: 'coupon' },
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
    const { goods } = cartStore;
    const {
      form: { member, address, coupon, note },
      address: addressList,
    } = store;
    const memberPanel = (
      <MemberPanel
        key="member"
        data={store.member}
        bindData={member}
        onSearch={this.onSearchMember}
        onBind={data => store.setForm({ member: data })}
        onUnbind={() => store.setForm({ member: undefined })}
      />
    );

    let couponPanel: any = (
      <EmptyPanel key="coupon">请先绑定会员再使用优惠券</EmptyPanel>
    );
    if (member) {
      const memberCoupon = toJS(member.coupon) || [];
      const couponData = sortCoupon(
        toJS(memberCoupon).map(item => ({
          ...item,
          disabled: !checkCoupon({ coupon: item, goods }),
        }))
      );
      couponPanel = (
        <CouponPanel
          key="coupon"
          data={couponData}
          value={coupon}
          onChange={value => store.setForm({ coupon: value })}
          onExchange={(code, clear) => this.onExchangeCoupon(code, clear)}
        />
      );
    }

    const addressPanel = (
      <AddressPanel
        key="address"
        data={toJS(addressList) || []}
        value={address}
        onChange={value => store.setForm({ address: value })}
      >
        <AddressForm
          store={addressStore}
          cb={this.setAddress}
          member={toJS(member)}
        />
      </AddressPanel>
    );
    const notePanel = (
      <NotePanel
        key="note"
        onChange={value => {
          store.setForm({
            note: value,
          });
        }}
        value={note}
      />
    );
    switch (store.tab) {
      case 'member':
        return memberPanel;
      case 'coupon':
        return couponPanel;
      case 'address':
        return addressPanel;
      case 'note':
        return notePanel;
    }

    // return [memberPanel, couponPanel, addressPanel, notePanel];
  };
  renderCenter = () => {
    return <CenterBlock>{this.renderTabs()}</CenterBlock>;
  };
  renderRight = () => {
    const { price, quantity } = cartStore;
    const {
      form: { point },
    } = store;

    const couponPrice = this.getCouponPrice();

    const pointPrice = math.Div(point || 0, 100, 2);
    let total = math.Sub(math.Sub(price, pointPrice, 2), couponPrice, 2);
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
      +couponPrice > 0 && {
        label: '优惠券:',
        value: `-¥${couponPrice}`,
        color: 'primary',
      },
      +pointPrice > 0 && {
        label: '积分抵扣:',
        value: `-¥${pointPrice}`,
        color: 'primary',
      },
      {
        label: '收银:',
        value: `¥${total}`,
      },
    ].filter(Boolean);

    return (
      <RightBlock>
        <TotalPanel
          data={data}
          onGoBack={this.onGoBack}
          onConfirm={this.onConfirm}
        />
      </RightBlock>
    );
  };
  getCouponPrice = () => {
    const { price } = cartStore;
    const {
      form: { coupon },
    } = store;

    return getCouponPrice(price, coupon);
  };
  form: any;
  render() {
    const { goods, sellerId } = cartStore;
    Object.keys(toJS(store.form)).forEach(item => item);

    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          <LeftBlock>
            <CheckoutForm
              store={store}
              cartStore={cartStore}
              goods={toJS(goods)}
              sellerId={sellerId}
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
