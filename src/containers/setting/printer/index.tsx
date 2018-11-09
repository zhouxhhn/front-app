import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { createForm } from 'rc-form';
import {
  Toast,
  FormItem,
  Button,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { Picker } from '@sipin/sipin-sales-cloud-components/src/components/setting';
import {
  mapPropsToFields,
  onFieldsChange,
} from '@sipin/sipin-sales-cloud-components/src/utils/create-form-options';
import { Modal } from 'antd-mobile';
import InputWithButton from '@sipin/sipin-sales-cloud-components/src/components/input-with-button/input-with-button';
import isSuccess from '../../../services/utils/is-success';
import settingStore from '../../../services/setting/store';
import { saveUser } from '../../../services/user/actions';
import userStore from '../../../services/user/store';
import ErrorText from '../error-text/index';
import lodopStore from '../../../services/lodop/store';
import { PRINTER_TYPE_SUNMI, PRINTER_TYPE_AO } from '../constant';
import FormItemWrapper from '../form-item-wrapper';

@observer
class Printer extends React.Component<any> {
  onSubmit = () => {
    const { form, store } = this.props;
    const { setting } = settingStore;
    form.validateFields(
      { force: true },
      async (errors, { printer, printerType, printerIp }) => {
        const hasErrors = !!errors;
        if (hasErrors) {
          return;
        }

        const data = {
          printerType: printerType[0],
          printerIp: printerType[0] === PRINTER_TYPE_AO ? printerIp : '',
          printer:
            printerType[0] === PRINTER_TYPE_AO && printer.length
              ? printer[0]
              : '',
        };

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
      }
    );
  };
  onSubmitIp = () => {
    const { form, store } = this.props;
    const { setting } = settingStore;

    form.validateFields(
      ['printerIp'],
      { force: true },
      async (errors, data) => {
        const hasErrors = !!errors;
        if (hasErrors) {
          return;
        }

        const { printerIp } = data;
        const modal = Modal.alert('加载打印服务', '正在连接打印主机...', []);
        try {
          store.setFormLoadingStatus(true);
          const lodopRes = await lodopStore.fetchJS(printerIp);
          modal.close();
          if (!lodopRes.error) {
            Toast.success('加载Lodop打印服务成功!');
            const newSetting = {
              ...toJS(setting),
              printerType: PRINTER_TYPE_AO,
              printerIp,
              printer: '',
            };

            const res = await store.submit(setting.shopCode, newSetting);
            if (isSuccess(res)) {
              settingStore.setStore('setting', newSetting);
              saveUser({ ...toJS(userStore.user), setting: newSetting });
              Toast.success('保存成功!');
            }
            store.setFormLoadingStatus(false);
          } else {
            Toast.success('加载Lodop打印服务失败!');
            store.setForm({
              printer: '',
            });
          }

          store.setFormLoadingStatus(false);
        } catch (e) {
          store.setFormLoadingStatus(false);
          modal.close();
          console.error(e);
        }
      }
    );
  };
  getFormConfigs = () => {
    const {
      store: {
        form: { printerType },
      },
    } = this.props;
    const { printerOptions } = lodopStore;
    const isAO =
      printerType && printerType.length && printerType[0] === PRINTER_TYPE_AO;
    const configs: any[] = [
      {
        type: 'react',
        key: 'printerType',
        label: '打印机类型',
        fieldProps: {
          extra: '打印机类型',
          options: [
            {
              label: '商米内置打印机',
              value: PRINTER_TYPE_SUNMI,
            },
            {
              label: 'AO打印机',
              value: PRINTER_TYPE_AO,
            },
          ],
        },
        options: {
          initialValue: [],
          rules: [
            {
              required: true,
              message: '打印机类型不能为空!',
              type: 'array',
            },
          ],
        },
        render() {
          return <Picker />;
        },
      },
      isAO && {
        type: 'react',
        key: 'printerIp',
        label: '打印主机IP',
        fieldProps: {
          wrapperWidth: 320,
          placeholder: '打印主机IP',
          buttonText: '绑 定',
          onSubmit: () => this.onSubmitIp(),
        },
        options: {
          initialValue: [],
          rules: [
            {
              required: true,
              message: '打印机IP不能为空!',
            },
            {
              validator(rule, value, callback) {
                const errors = [];
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if (!reg.test(value)) {
                  errors.push('请输入正确的 IP!');
                }
                callback(errors);
              },
            },
          ],
        },
        render() {
          return <InputWithButton />;
        },
      },
      isAO && {
        type: 'react',
        key: 'printer',
        label: '选择打印机',
        fieldProps: {
          extra: '选择打印机',
          data: printerOptions || [],
        },
        options: {
          initialValue: '',
          rules: [
            {
              required: true,
              message: '请选择打印机!',
            },
          ],
        },
        render() {
          return <Picker />;
        },
      },
    ].filter(Boolean);

    return configs;
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

const PrinterForm = createForm({
  mapPropsToFields,
  onFieldsChange,
})(Printer);

export default PrinterForm;
