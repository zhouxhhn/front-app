import * as React from 'react';
import {
  Tabs,
  Flex,
  KeyboardWithDisplay,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import { TotalPanel } from '@sipin/sipin-sales-cloud-components/src/components/checkout';
import { observer } from 'mobx-react/native';
import { Modal } from 'antd-mobile';
import math from '@sipin/basic-libs/lib/js/math';
import store from './store';
import PaymentForm from './form';
import isSuccess from '../../services/utils/is-success';
import {
  TYPE_PAY_POS_BANK,
  BUSI_SALE_BANK,
  TYPE_PAY_POS_QR,
  BUSI_SALE_QR,
  TYPE_PAY_CASH,
  TAB_PAY,
  TAB_PAY_OPTIONS,
  TAB_DISCOUNT_OPTIONS,
  TAB_DISCOUNT_A,
  TAB_DISCOUNT_B,
  TYPE_PAY,
  TYPE_PAY_POS_OTHER,
} from './constant';
import { LeftBlock, RightBlock, CenterBlock } from './blocks';
import { MainBlock } from '../../components/block';
import settingStore from '../../services/setting/store';
import userStore from '../../services/user/store';
import { POS_TYPE_NONE } from '../setting/constant';
import { transformSaleOrder } from './utils';
import orderPrint from '../sales-order/print';

export const WAIT_PAY = 0;

@observer
export default class Payment extends React.Component<any> {
  componentDidMount() {
    this.initOrder(this.props);
  }

  componentWillReceiveProps(props) {
    this.initOrder(props);
  }

  initOrder = async props => {
    const { app } = this.props;
    store.reset();
    const {
      match: {
        params: { no },
      },
    } = props;
    const modal = Modal.alert('获取订单数据', '正在加载...', []);
    try {
      const res = await store.fetchOrder(no);
      modal.close();
      if (isSuccess(res)) {
        const order = res.data;
        if (order.statusId === WAIT_PAY) {
          store.setOrder(order);
        } else {
          Toast.fail(`该订单状态为${order.status}!`);
          app.push(`/sales-order/${order.no}`);
        }
      } else {
        app.push('/sales-order');
      }
    } catch (err) {
      console.error(err);
      modal.close();
      app.push('/sales-order');
    }
  };
  onGoBack = () => {
    const {
      match: {
        params: { no },
      },
      app,
    } = this.props;
    app.push(`/sales-order/${no}`);
  };

  pos = async data => {
    const { setting } = settingStore;
    if (!setting.posIp) {
      Toast.fail('POS机 IP为空, 请检查设置!');
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const req = new Request(`http://${setting.posIp}:9801/trans`, {
      method: 'POST',
      mode: 'cors',
      body: Object.keys(data)
        .map(item => `${item}=${data[item]}`)
        .join('&'), // 'business_id=100300001&amount=1&trans_check=31003100&oper_no=2',
      headers,
    });
    try {
      const respone: any = await fetch(req);
      const res: any = await respone.json();
      if (res.rejcode === '00') {
        return {
          businessId: res.business_id,
          cardno: res.cardno,
          merchId: res.merch_id,
          merchName: res.merch_name,
          traceNo: res.trace_no,
          payableAmount: +math.Div(Number(res.amount), 100, 2),
          cups: res.cups,
        };
      } else {
        console.error(res);
        Toast.fail(res.rejcode_cn || '支付失败, 请重新支付');

        return {
          errors: res,
        };
      }
    } catch (err) {
      console.error(err);
      Toast.fail('POS机请求失败, 请检查POS机或者POS机 IP设置');

      return {
        errors: err,
      };
    }
  };
  submit = async data => {
    const { app } = this.props;
    const {
      form: { no },
    } = store;
    const modal = Modal.alert('确认收银', '正在提交...', []);
    try {
      const res = await store.submit(data);
      if (isSuccess(res)) {
        Toast.success('收银成功!');
        const orderRes = await store.fetchOrder(no);
        if (isSuccess(orderRes)) {
          store.reset();
          orderPrint(transformSaleOrder(orderRes.data));
        }
        app.push(`/sales-order/${no}`);
      }
      modal.close();
    } catch (err) {
      console.error(err);
      modal.close();
    }
  };
  confirmPay = async () => {
    const { user } = userStore;
    const { setting } = settingStore;
    const { giveChange } = store;

    const {
      form: { type, pay, payableAmount },
    } = store;

    // 如果应收为0, 则可以直接确认收银,
    if (+payableAmount === 0) {
      return this.submit({
        paymentType: 'cashPayment',
        createrId: +user.id,
        payableAmount: 0,
        giveChange: 0,
      });
    }

    if (
      !~[
        TYPE_PAY_CASH,
        TYPE_PAY_POS_BANK,
        TYPE_PAY_POS_QR,
        TYPE_PAY_POS_OTHER,
      ].indexOf(type)
    ) {
      return Toast.fail('请选择支付方式!');
    }

    if (!(+pay > 0)) {
      return Toast.fail('请输入支付金额!');
    }

    if (type !== TYPE_PAY_CASH && +pay > +store.payMax) {
      return Toast.fail('非现金支付, 支付金额不能大于应收金额!');
    }

    const baseData = {
      createrId: +user.id,
      payableAmount: +pay,
      giveChange: giveChange ? +giveChange : 0,
    };

    if (
      // 现金支付
      type === TYPE_PAY_CASH ||
      // `其他`支付, 参数与现金一致, paymentType 不同
      type === TYPE_PAY_POS_OTHER ||
      // 扫码和刷卡(不使用通联POS机的), 参数与现金一致, paymentType 不同
      setting.posType === POS_TYPE_NONE
    ) {
      // 现金支付, `其他`支付, 以及不调用通联POS机支付
      let paymentType = 'cashPayment'; // 现金支付
      if (type === TYPE_PAY_POS_BANK) {
        paymentType = 'cardPayment'; // 刷卡, 不调用通联POS机支付
      } else if (type === TYPE_PAY_POS_QR) {
        paymentType = 'scanPayment'; // 扫码, 不调用通联POS机支付
      } else if (type === TYPE_PAY_POS_OTHER) {
        paymentType = 'othersPayment'; // `其他`支付
      }
      const submitData = {
        ...baseData,
        paymentType,
        // paymentTransactionCode, 现金支付不需要交易码, 非对接通联POS机支付不需要交易码
      };
      this.submit(submitData);
    } else {
      // 调用通联POS机支付
      // 需要先生成交易号
      const getPaymentCodeRes = await store.getPaymentCodeSalesOrder();
      if (!isSuccess(getPaymentCodeRes)) {
        return;
      }
      const paymentTransactionCode = getPaymentCodeRes.data;

      const posData = {
        business_id: 0,
        amount: math.Mul(pay, 100, 0),
        trans_check: paymentTransactionCode,
        oper_no: user.id,
      };
      let paymentType = '';
      if (type === TYPE_PAY_POS_BANK) {
        posData.business_id = BUSI_SALE_BANK;
        paymentType = 'cardPayment';
      } else if (type === TYPE_PAY_POS_QR) {
        posData.business_id = BUSI_SALE_QR;
        paymentType = 'scanPayment';
      }
      const modal = Modal.alert('支付处理中', '请在POS机操作支付...', []);
      const posRes = await this.pos(posData);
      modal.close();
      if (posRes && !posRes.errors) {
        this.submit({
          ...baseData,
          ...posRes,
          paymentType,
          paymentTransactionCode,
        });
      }
    }
  };
  renderTab = () => {
    const { form } = store;
    const opts = store.tab === TAB_PAY ? TAB_PAY_OPTIONS : TAB_DISCOUNT_OPTIONS;
    let max;
    let displayRightButton = false;
    let onRightButtonClick: any;
    let suffix = '';
    let digits = 2;
    switch (store.tab) {
      case TAB_PAY:
        if (form.type !== TYPE_PAY_CASH || +form.payableAmount === 0) {
          max = +store.payMax;
        }
        displayRightButton = true;
        onRightButtonClick = () => store.onChange(store.payMax);
        break;
      case TAB_DISCOUNT_A:
        max = 100;
        suffix = '%';
        digits = 0;
        break;
      case TAB_DISCOUNT_B:
        max = +form.originalPayableAmount;
        break;
    }
    const keyboardProps = {
      value:
        store.tab === TAB_PAY ? (+form.pay).toString() : form.discount.value,
      onChange: value => store.onChange(value),
      digits,
      min: 0,
      max,
      displayRightButton,
      onRightButtonClick,
      suffix,
    };

    return (
      <>
        <Tabs
          tabs={opts}
          initialPage={store.tab}
          page={store.tab}
          onChange={tab => {
            store.setTab(tab.key);
          }}
          animated={false}
          swipeable={false}
        >
          <KeyboardWithDisplay {...keyboardProps} />
        </Tabs>
      </>
    );
  };
  renderLeft = () => {
    return (
      <LeftBlock>
        <PaymentForm store={store} activeKey={store.tab} />
      </LeftBlock>
    );
  };
  renderCenter = () => {
    return <CenterBlock>{this.renderTab()}</CenterBlock>;
  };
  renderRight = () => {
    const data: any = [
      {
        label: '应付金额:',
        value: `¥${store.form.payableAmount}`,
      },
      +store.form.paidAmount > 0 && {
        label: '已收金额:',
        value: `¥${store.form.paidAmount}`,
      },
      {
        label: '本次收款金额:',
        value: `¥${store.form.pay}`,
      },
      {
        label: '收款方式:',
        value: `${TYPE_PAY[store.form.type]}`,
      },
      +store.giveChange > 0 && {
        label: '找零:',
        value: `¥${store.giveChange}`,
      },
      +store.paidAmount > 0 && {
        label: '剩余尾款:',
        value: `¥${store.finalPayment}`,
      },
    ].filter(Boolean);

    return (
      <RightBlock>
        <TotalPanel
          data={data}
          onGoBack={this.onGoBack}
          onConfirm={this.confirmPay}
        />
      </RightBlock>
    );
  };
  render() {
    return (
      <MainBlock>
        <Flex style={{ height: '100%' }}>
          {this.renderLeft()}
          {this.renderCenter()}
          {this.renderRight()}
        </Flex>
      </MainBlock>
    );
  }
}
