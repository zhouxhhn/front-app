import * as React from 'react';
import { observer } from 'mobx-react/native';
import { createForm } from 'rc-form';
import styled from 'styled-components/native';
import {
  FormItem,
  FormItemLabel,
} from '@sipin/sipin-sales-cloud-components/src/components/form-item';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import {
  FormItemWrapper,
  CheckoutAddress,
  CheckoutGoods as Goods,
  CheckoutNote as Note,
} from '@sipin/sipin-sales-cloud-components/src/components/checkout-form';
import { errorColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';

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
    return [
      {
        type: 'react',
        key: 'address',
        fieldProps: {
          label: '收货地址',
          placeholder: '填写收货地址',
        },
        options: {
          rules: [
            {
              required: true,
              message: '有非自提商品, 收货地址 不能为空!',
            },
          ],
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
    ];
  };
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
