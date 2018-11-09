import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { createForm } from 'rc-form';
import {
  Toast,
  FormItem,
  Button,
} from '@sipin/sipin-sales-cloud-components/src/components';
import {
  Input,
  Picker,
} from '@sipin/sipin-sales-cloud-components/src/components/setting';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import isSuccess from '../../../services/utils/is-success';
import settingStore from '../../../services/setting/store';
import { saveUser } from '../../../services/user/actions';
import userStore from '../../../services/user/store';
import ErrorText from '../error-text/index';
import { POS_TYPE_NONE, POS_TYPE_ALLINPAY } from '../constant';
import FormItemWrapper from '../form-item-wrapper';

@observer
class POS extends React.Component<any> {
  onSubmit = () => {
    const { form, store } = this.props;
    const { setting } = settingStore;
    form.validateFields({ force: true }, async (errors, { posType, posIp }) => {
      const hasErrors = !!errors;
      if (hasErrors) {
        return;
      }
      try {
        store.setFormLoadingStatus(true);
        let data = {
          posType: posType[0],
          posIp:
            posType && posType.length && posType[0] === POS_TYPE_ALLINPAY
              ? posIp
              : '',
        };
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
    const {
      store: {
        form: { posType },
      },
    } = this.props;

    return [
      {
        type: 'react',
        key: 'posType',
        label: 'POS机类型',
        fieldProps: {
          extra: 'POS机类型',
          options: [
            {
              label: '通联POS机',
              value: POS_TYPE_ALLINPAY,
            },
            {
              label: '不使用POS机',
              value: POS_TYPE_NONE,
            },
          ],
        },
        options: {
          initialValue: [],
          rules: [
            {
              required: true,
              message: 'POS类型不能为空!',
              type: 'array',
            },
          ],
        },
        render() {
          return <Picker />;
        },
      },
      posType &&
        posType.length &&
        posType[0] === POS_TYPE_ALLINPAY && {
          type: 'react',
          key: 'posIp',
          label: 'POS机IP',
          fieldProps: {
            placeholder: 'POS机IP',
          },
          options: {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'POS机IP不能为空!',
              },
              {
                validator(rule, value, callback) {
                  const errors = [];
                  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                  if (!reg.test(value)) {
                    errors.push('请输入正确的ip!');
                  }
                  callback(errors);
                },
              },
            ],
          },
          render() {
            return <Input />;
          },
        },
    ].filter(Boolean);
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

const POSForm = createForm({
  mapPropsToFields,
  onFieldsChange,
})(POS);

export default POSForm;
