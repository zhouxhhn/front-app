import * as React from 'react';
import { observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import styled from 'styled-components/native';
import {
  FormItem,
  FormItemLabel,
} from '@sipin/sipin-sales-cloud-components/src/components/form-item';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import math from '@sipin/basic-libs/lib/js/math';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import {
  CheckoutInput,
  FormItemWrapper,
  CheckoutAddress,
  CheckoutGoods as Goods,
  CheckoutCoupon as Coupon,
  CheckoutNote as Note,
  CheckoutMember as Member,
} from '@sipin/sipin-sales-cloud-components/src/components/checkout-form';
import { errorColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import getCouponPrice from './utils/get-coupon-price';

const Container = styled.View`
  background-color: #fff;
  height: 100%;
`;

const ErrorText = styled.Text`
  padding-left: 24;
  padding-right: 24;
  padding-top: 24;
  color: ${errorColor};
`;

@observer
export class Checkout extends React.Component<any> {
  onChangeTab = tab => {
    const { onChangeTab } = this.props;
    onChangeTab && onChangeTab(tab);
  };
  getFormConfigs = () => {
    const {
      cartStore,
      cartStore: { price },
      store: {
        form: { member },
      },
    } = this.props;

    return [
      {
        type: 'react',
        key: 'member',
        fieldProps: {
          label: '会员',
          placeholder: '输入手机号选择会员',
          // extra: member && member.levelName,
          // disabled: true,
        },
        options: {
          initialValue: '',
        },
        render: () => {
          return <Member onPress={() => this.onChangeTab('member')} />;
        },
      },
      member && {
        type: 'react',
        key: 'coupon',
        fieldProps: {
          label: '优惠券',
          placeholder: '需要绑定会员信息后使用',
        },
        render: () => {
          return <Coupon onPress={() => this.onChangeTab('coupon')} />;
        },
      },
      member && {
        type: 'react',
        key: 'point',
        fieldProps: {
          type: 'number',
          label: '积分抵扣',
          placeholder: '请输入使用积分数额',
          extra: `可用积分：${member.point}`,
        },
        options: {
          initialValue: '',
          rules: [
            {
              validator: (rule, value, callback) => {
                var errors = [];
                if (isNaN(value)) {
                  errors.push('积分必须为数字!');
                }
                if (value < 0) {
                  errors.push('使用积分不能小于0!');
                }
                if (value > member.point) {
                  errors.push(`使用积分不能大于可用积分${member.point}!`);
                }
                let max = math.Sub(price, this.getCouponPrice(), 2);
                if (+max < 0) {
                  max = '0.00';
                }
                if (value / 100 > +max) {
                  errors.push(`使用积分不能大于订单价格${max}!`);
                }
                callback(errors);
              },
            },
          ],
        },
        render: () => {
          return <CheckoutInput />;
        },
      },
      {
        type: 'react',
        key: 'address',
        fieldProps: {
          label: '收货地址',
          placeholder: '填写收货地址',
        },
        options: {
          rules:
            cartStore.needDelivery === true
              ? [
                  {
                    required: true,
                    message: '有非自提商品, 收货地址 不能为空!',
                  },
                ]
              : [],
        },
        render: () => {
          return (
            <CheckoutAddress onPress={() => this.onChangeTab('address')} />
          );
        },
      },
      {
        type: 'react',
        key: 'note',
        fieldProps: {
          placeholder: '请输入备注',
          label: '备注',
        },
        render: () => {
          return <Note onPress={() => this.onChangeTab('note')} />;
        },
      },
    ].filter(Boolean);
  };
  getCouponPrice() {
    const {
      cartStore: { price },
      store: {
        form: { coupon },
      },
    } = this.props;

    return getCouponPrice(price, coupon);
  }
  renderGoods() {
    const { goods = [] } = this.props;

    return (
      <FormItemWrapper>
        <Flex justify="center">
          <FormItemLabel>商品信息</FormItemLabel>
          <Flex.Item>
            <Goods src={goods.map(item => item.imgPath)} />
          </Flex.Item>
        </Flex>
      </FormItemWrapper>
    );
  }
  render() {
    const { form, activeKey } = this.props;
    const configs = this.getFormConfigs();
    const items: any = configs.map(item => (
      <FormItemWrapper key={item.key} active={item.key === activeKey}>
        <FormItem key={item.key} configs={item} form={form} />
      </FormItemWrapper>
    ));
    const fieldsError = form.getFieldsError();
    const errors = Object.keys(fieldsError)
      .filter(item => !!fieldsError[item])
      .map(item => fieldsError[item].join(' '))
      .join(' ');

    return (
      <Container>
        {this.renderGoods()}
        {items}
        <ErrorText>{errors}</ErrorText>
      </Container>
    );
  }
}

const CheckoutForm = createForm({
  mapPropsToFields,
  onFieldsChange,
})(Checkout);

export default CheckoutForm;
