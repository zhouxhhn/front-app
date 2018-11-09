import * as React from 'react';
import { observer } from 'mobx-react/native';
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
import Picker from './picker';
import { ROLE_STATUS } from '../../constants';

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
    return [
      {
        type: 'react',
        key: 'name',
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '名称不能为空!',
            },
          ],
        },
        render() {
          return <Input label="名称" />;
        },
      },
      {
        type: 'react',
        key: 'status',
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '状态不能为空!',
            },
          ],
        },
        render() {
          return (
            <Picker
              label="状态"
              options={Object.keys(ROLE_STATUS).map(key => ({
                value: +key,
                label: ROLE_STATUS[key],
              }))}
            />
          );
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
