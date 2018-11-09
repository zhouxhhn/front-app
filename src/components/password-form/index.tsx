import * as React from 'react';
import { observer } from 'mobx-react/native';
import {
  Toast,
  ConfirmModal,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { toJS } from 'mobx';
import PasswordForm from './form';
import store from './store';
import isSuccess from '../../services/utils/is-success';

@observer
class PasswordFormModal extends React.Component<any> {
  onConfirm = () => {
    const {
      form: { loadingState },
    } = store;
    if (loadingState === 0) {
      this.onSubmit();
    } else {
      Toast.fail('数据提交中, 请勿重复操作');
    }
  };

  onSubmit = () => {
    const form = this.form;

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
          Toast.success('密码修改成功!');
          this.modal.close();
        }
        this.onReset();
        store.setFormLoadingStatus(false);
      } catch (e) {
        store.setFormLoadingStatus(false);
      }
    });
  };
  onReset = () => {
    // this.form.resetFields();
    store.reset();
  };
  modal: any;
  form: any;
  render() {
    Object.keys(toJS(store.form)).forEach(() => {});

    return (
      <ConfirmModal ref={c => (this.modal = c)} onConfirm={this.onConfirm}>
        <PasswordForm
          title="修改密码"
          store={store}
          wrappedComponentRef={c => {
            if (c && c.props) {
              this.form = c.props.form;
            }
          }}
        />
      </ConfirmModal>
    );
  }
}

export default PasswordFormModal;
