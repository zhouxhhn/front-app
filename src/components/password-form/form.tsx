import * as React from 'react';
import { observer } from 'mobx-react';
import { createForm } from 'rc-form';
import styled from 'styled-components/native';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import {
  FormItem,
  Flex,
  ModalFormInput as Input,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { errorColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';

const Container = styled.View`
  padding-top: 24;
  padding-left: 24;
  padding-right: 24;
  padding-bottom: 24;
`;
const FormWrap = styled(Flex)`
  width: 720;
  margin-left: auto;
  margin-right: auto;
`;
const ErrorText = styled.Text`
  color: ${errorColor};
  text-align: center;
`;

@observer
export class Password extends React.Component<any> {
  getFormConfigs = () => {
    // const { store } = this.props;

    return [
      {
        type: 'react',
        key: 'oldPassword',
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '旧密码不能为空!',
            },
          ],
        },
        render() {
          return <Input label="旧密码" secureTextEntry />;
        },
      },
      {
        type: 'react',
        key: 'newPassword',
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '新密码不能为空!',
            },
          ],
        },
        render() {
          return <Input label="新密码" secureTextEntry />;
        },
      },
      {
        type: 'react',
        key: 'renewPassword',
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '确认密码不能为空!',
            },
          ],
        },
        render() {
          return <Input label="确认密码" secureTextEntry />;
        },
      },
    ];
  };
  render() {
    const { form } = this.props;
    const configs = this.getFormConfigs();
    const items: any = configs.map(item => (
      <Flex.Item key={item.key}>
        <FormItem key={item.key} configs={item} form={form} />
      </Flex.Item>
    ));
    const fieldsError = form.getFieldsError();
    const errors = Object.keys(fieldsError)
      .filter(item => !!fieldsError[item])
      .map(item => fieldsError[item].join(' '))
      .join(' ');

    return (
      <Container>
        <FormWrap>{items}</FormWrap>
        <ErrorText>{errors}</ErrorText>
      </Container>
    );
  }
}

const PasswordForm = createForm({
  mapPropsToFields,
  onFieldsChange,
})(Password);

export default PasswordForm;
