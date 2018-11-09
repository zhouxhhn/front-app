import * as React from 'react';
import { observer } from 'mobx-react/native';
import styled from 'styled-components/native';
import { FormItemLabel } from '@sipin/sipin-sales-cloud-components/src/components/form-item';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  CheckoutInput,
  FormItemWrapper,
  CheckoutGoods as Goods,
} from '@sipin/sipin-sales-cloud-components/src/components/checkout-form';
import { PaymentMethod } from '@sipin/sipin-sales-cloud-components/src/components/payment';
import { mainColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import { toJS } from 'mobx';
import { TYPE_PAY_OPTIONS, TAB_DISCOUNT_A, TAB_PAY } from './constant';

const Container = styled.View`
  background-color: #fff;
  height: 100%;
`;

const FormItemExtraTouchableOpacity = styled.TouchableOpacity`
  border-style: solid;
  border-width: 2;
  border-color: ${mainColor};
  border-radius: 28;
  width: 100;
  margin-top: 16;
  margin-bottom: 16;
`;
const FormItemExtraText = styled.Text`
  line-height: 24;
  color: ${mainColor};
  text-align: center;
  font-size: 12;
`;

@observer
export class Payment extends React.Component<any> {
  getFormConfigs = () => {
    const { store } = this.props;

    return [
      {
        key: 'originalPayableAmount',
        fieldProps: {
          label: '订单金额',
          disabled: true,
          type: 'primary',
        },
        component: CheckoutInput,
      },
      {
        key: 'wholeDiscount',
        fieldProps: {
          label: '整单优惠',
          extra: (
            <FormItemExtraTouchableOpacity
              {...clickEvent(() => store.setTab(TAB_DISCOUNT_A))}
            >
              <FormItemExtraText>调整优惠</FormItemExtraText>
            </FormItemExtraTouchableOpacity>
          ),
          disabled: true,
          type: 'primary',
          value: store.wholeDiscount,
        },
        component: CheckoutInput,
      },
      {
        key: 'payableAmount',
        fieldProps: {
          label: '应收金额',
          extra: (
            <FormItemExtraTouchableOpacity
              {...clickEvent(() => store.wipeZero())}
            >
              <FormItemExtraText>抹零</FormItemExtraText>
            </FormItemExtraTouchableOpacity>
          ),
          disabled: true,
          type: 'primary',
        },
        component: CheckoutInput,
      },
      +store.form.payableAmount === 0
        ? {
            key: 'noType',
            fieldProps: {
              label: '支付方式',
              disabled: true,
              value: '无需收款',
              onPress: () => store.setTab(TAB_PAY),
            },
            component: CheckoutInput,
          }
        : {
            key: 'type',
            fieldProps: {
              label: '支付方式',
              options: TYPE_PAY_OPTIONS,
              onChange: value => {
                store.setForm({ type: value });
                store.setTab(TAB_PAY);
              },
            },
            component: PaymentMethod,
          },
      {
        key: 'pay',
        fieldProps: {
          label: '支付金额',
          placeholder: '请输入支付金额',
          disabled: true,
          onPress: () => store.setTab(TAB_PAY),
        },
        component: CheckoutInput,
      },
    ].filter(Boolean);
  };
  renderGoods() {
    const {
      store: {
        form: { goods },
      },
    } = this.props;

    return (
      <FormItemWrapper>
        <Flex justify="center" style={{ minHeight: 84 }}>
          <FormItemLabel>商品信息</FormItemLabel>
          <Flex.Item>
            <Goods src={toJS(goods)} />
          </Flex.Item>
        </Flex>
      </FormItemWrapper>
    );
  }
  renderFormItem(item) {
    const { store, activeKey } = this.props;
    const { component, fieldProps = {}, key } = item;
    const C: any = component;

    return (
      <FormItemWrapper key={key} active={key === activeKey}>
        <C key={key} value={store.form[key]} {...fieldProps} />
      </FormItemWrapper>
    );
  }
  render() {
    const configs = this.getFormConfigs();
    const items: any = configs.map(item => {
      return this.renderFormItem(item);
    });

    return (
      <Container>
        {this.renderGoods()}
        {items}
      </Container>
    );
  }
}

export default Payment;
