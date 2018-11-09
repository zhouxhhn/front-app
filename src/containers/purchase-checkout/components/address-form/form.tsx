import * as React from 'react';
import { observer } from 'mobx-react';
import { createForm } from 'rc-form';
import {
  AreaPicker,
  AddressInput,
} from '@sipin/sipin-sales-cloud-components/src/components/address-form';
import styled from 'styled-components/native';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import {
  FormItem,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import {
  errorColor,
  textColorMain,
  mainColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import isSuccess from '../../../../services/utils/is-success';

const Container = styled.View`
  padding-top: 24;
  padding-left: 24;
  padding-right: 24;
  padding-bottom: 24;
`;

const Title = styled.Text`
  color: ${textColorMain};
  margin-bottom: 20;
`;
const ErrorText = styled.Text`
  color: ${errorColor};
`;

const Button = styled.TouchableOpacity`
  background-color: ${mainColor};
  border-radius: 4;
  height: 30;
  width: 90;
  margin-top: 24;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 14;
  text-align: center;
  line-height: 30;
`;

@observer
export class Address extends React.Component<any> {
  onSubmit = () => {
    const { form, store, cb } = this.props;

    form.validateFields({ force: true }, async errors => {
      const hasErrors = !!errors;
      if (hasErrors) {
        return;
      }
      const data = form.getFieldsValue();

      try {
        store.setFormLoadingStatus(true);

        const res = await store.submit({ ...data });
        if (isSuccess(res)) {
          cb(res.data);
          this.onReset();
          Toast.success('地址添加成功!');
        }
        store.setFormLoadingStatus(false);
      } catch (e) {
        store.setFormLoadingStatus(false);
      }
    });
  };
  onReset = () => {
    const { store, form } = this.props;
    form.resetFields();
    store.reset();
  };
  getFormConfigs = () => {
    const { store } = this.props;

    return [
      {
        type: 'react',
        key: 'consignee',
        fieldProps: {
          placeholder: '请输入联系人',
          id: 'consignee',
        },
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '联系人不能为空!',
            },
          ],
        },
        render() {
          return <AddressInput label="收货人" />;
        },
      },
      {
        type: 'react',
        key: 'mobile',
        fieldProps: {
          placeholder: '请输入联系电话',
          id: 'mobile',
        },
        options: {
          initialValue: '',
          validateTrigger: 'onBlur',
          rules: [
            {
              required: true,
              message: '联系电话不能为空!',
            },
            {
              len: 11,
              message: '联系电话必须为11位手机号码!',
            },
          ],
        },
        render() {
          return <AddressInput label="联系电话" />;
        },
      },
      {
        type: 'react',
        key: 'code',
        options: {
          initialValue: [],
          rules: [
            {
              required: true,
              message: '地区不能为空!',
            },
          ],
        },
        render() {
          return <AreaPicker getRegion={store.getRegion} />;
        },
      },
      {
        type: 'react',
        key: 'address',
        fieldProps: {
          placeholder: '请输入街道地址',
          id: 'address',
        },
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '街道地址不能为空!',
            },
          ],
        },
        render() {
          return <AddressInput label="详细街道" />;
        },
      },
    ];
  };
  renderFormButtons() {
    const {
      store: {
        form: { loadingState },
      },
    } = this.props;

    return (
      <Button
        {...clickEvent(() => {
          loadingState === 0 && this.onSubmit();
        })}
      >
        <ButtonText>
          {loadingState > 0 ? '正在提交...' : '使用新地址'}
        </ButtonText>
      </Button>
    );
  }
  render() {
    const { form } = this.props;
    const configs = this.getFormConfigs();
    const items: any = configs.map(item => (
      <FormItem key={item.key} configs={item} form={form} />
    ));
    const fieldsError = form.getFieldsError();
    const errors = Object.keys(fieldsError)
      .filter(item => !!fieldsError[item])
      .map(item => fieldsError[item].join(' '))
      .join(' ');

    return (
      <Container>
        <Title>新增地址</Title>
        {items}
        <ErrorText>{errors}</ErrorText>
        {this.renderFormButtons()}
      </Container>
    );
  }
}

const AddressForm = createForm({
  mapPropsToFields,
  onFieldsChange,
})(Address);

export default AddressForm;
