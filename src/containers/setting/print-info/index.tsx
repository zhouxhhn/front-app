import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { createForm } from 'rc-form';
import {
  Toast,
  FormItem,
  Button,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { Input } from '@sipin/sipin-sales-cloud-components/src/components/setting';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import isSuccess from '../../../services/utils/is-success';
import settingStore from '../../../services/setting/store';
import { saveUser } from '../../../services/user/actions';
import userStore from '../../../services/user/store';
import ErrorText from '../error-text/index';
import FormItemWrapper from '../form-item-wrapper';

@observer
class PrintInfo extends React.Component<any> {
  onSubmit = () => {
    const { form, store } = this.props;
    const { setting } = settingStore;
    form.validateFields({ force: true }, async (errors, data) => {
      const hasErrors = !!errors;
      if (hasErrors) {
        return;
      }
      try {
        store.setFormLoadingStatus(true);
        const newSetting = { ...toJS(setting), ...data };

        const res = await store.submit(setting.shopCode, newSetting);
        if (isSuccess(res)) {
          settingStore.setStore('setting', newSetting);
          saveUser({ ...toJS(userStore.user), setting: newSetting });
          Toast.success('保存成功!');
        }
        store.setFormLoadingStatus(false);
      } catch (e) {
        console.error(e);
        store.setFormLoadingStatus(false);
      }
    });
  };
  getFormConfigs = () => {
    return [
      {
        type: 'react',
        key: 'shopPhone',
        label: '店铺电话',
        fieldProps: {
          placeholder: '店铺电话',
        },
        render() {
          return <Input />;
        },
      },
      {
        type: 'react',
        key: 'shopAddress',
        label: '店铺地址',
        fieldProps: {
          placeholder: '店铺地址',
          numberOfLines: 5,
          multiline: true,
        },
        render() {
          return <Input />;
        },
      },
      {
        type: 'react',
        key: 'ticketTips',
        label: '票尾提示',
        fieldProps: {
          placeholder: '票尾提示',
          numberOfLines: 5,
          multiline: true,
        },
        render() {
          return <Input />;
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
    let submitBtn = (
      <Button type="primary" onClick={this.onSubmit}>
        保存
      </Button>
    );
    if (loadingState > 0) {
      submitBtn = (
        <Button disabled type="primary">
          正在提交...
        </Button>
      );
    }

    return submitBtn;
  }
  render() {
    const { form } = this.props;
    const configs = this.getFormConfigs();
    const items: any = configs.map(item => (
      <FormItemWrapper key={item.key} label={item.label}>
        <FormItem key={item.key} configs={item} form={form} />
      </FormItemWrapper>
    ));
    const fieldsError = form.getFieldsError();
    const errors = Object.keys(fieldsError)
      .filter(item => !!fieldsError[item])
      .map(item => fieldsError[item].join(' '))
      .join(' ');

    return (
      <>
        {items}
        <ErrorText>{errors}</ErrorText>
        {this.renderFormButtons()}
      </>
    );
  }
}

const PrintInfoForm = createForm({
  mapPropsToFields,
  onFieldsChange,
})(PrintInfo);

export default PrintInfoForm;
