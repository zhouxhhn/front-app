import math from '@sipin/basic-libs/lib/js/math';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { action, computed, observable, toJS } from 'mobx';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';
import {
  TAB_DISCOUNT_A,
  TAB_DISCOUNT_B,
  TAB_PAY,
  TYPE_PAY_POS_BANK,
} from './constant';
import { transformSaleOrder } from './utils';

const formStoreKeys: {
  no: string; // 订单号
  goods: any[]; // 商品
  originalPayableAmount: string; // 原单合计
  payableAmount: string; // 优惠后应收
  paidAmount: string; // 已收
  pay: string; // 本次支付金额
  type: '0' | '1' | '2' | '3'; // 支付类型
  discount: {
    type?: '0' | '1';
    value: number;
  };
} = {
  no: '',
  goods: [],
  originalPayableAmount: '0.00',
  payableAmount: '0.00',
  paidAmount: '0.00',
  pay: '0.00',
  type: TYPE_PAY_POS_BANK,
  discount: {
    type: TAB_DISCOUNT_B,
    value: 0,
  },
};

class Store {
  @observable
  tab: string = TAB_PAY;
  @observable
  form = formStoreKeys;

  // 本次最多可收
  @computed
  get payMax() {
    const { payableAmount, paidAmount } = this.form;

    return math.Sub(payableAmount, paidAmount, 2);
  }
  // 整单优惠
  @computed
  get wholeDiscount() {
    const { originalPayableAmount, payableAmount } = this.form;

    return math.Sub(originalPayableAmount, payableAmount, 2);
  }
  // 找零
  @computed
  get giveChange() {
    const { payableAmount } = this.form;
    const paidAmount = this.paidAmount;

    return +paidAmount > +payableAmount
      ? math.Sub(paidAmount, payableAmount, 2)
      : '0.00';
  }
  // 已收
  @computed
  get paidAmount() {
    const { pay, paidAmount } = this.form;

    return math.Add(paidAmount, pay, 2);
  }
  @computed
  get finalPayment() {
    const { pay, paidAmount, payableAmount } = this.form;

    const finalPayment = math.Sub(
      payableAmount,
      math.Add(paidAmount, pay, 2),
      2
    );

    return +finalPayment > 0 ? finalPayment : '0.00';
  }

  @action
  setStore(key, value) {
    this[key] = value;
  }

  @action
  setTab(value) {
    this.tab = value;
    if (value !== TAB_PAY) {
      this.setForm({
        discount: {
          type: value,
          value: '0',
        },
      });
    }
  }

  @action
  setForm(form) {
    this.form = { ...toJS(this.form), ...form };
  }

  onChange(value) {
    const tab = this.tab;
    const { originalPayableAmount } = this.form;
    let { payableAmount, pay } = this.form;
    let data: any = {};
    switch (tab) {
      case TAB_PAY:
        pay = (+value).toFixed(2);
        data = {
          pay,
        };
        break;
      case TAB_DISCOUNT_A:
      case TAB_DISCOUNT_B:
        payableAmount =
          tab === TAB_DISCOUNT_A
            ? math.Mul(originalPayableAmount, math.Div(value, 100), 2)
            : math.Sub(originalPayableAmount, value, 2);
        data = {
          discount: {
            type: tab,
            value,
          },
          payableAmount,
          pay: '0.00', // 调整优惠时, 重置支付金额
        };
        this.wholeDiscountSalesOrder(payableAmount);
        break;
    }
    this.setForm(data);
  }

  wipeZero() {
    const payableAmount = Math.floor(+this.form.payableAmount).toFixed(2);

    this.setForm({
      payableAmount,
    });

    this.wholeDiscountSalesOrder(payableAmount);
  }

  async wholeDiscountSalesOrder(payableAmount) {
    const orderNo = this.form.no;
    const res = await proxy(
      webapi.order.wholeDiscountSalesOrder(orderNo, {
        payableAmount: +payableAmount,
      })
    );
    if (isSuccess(res)) {
      Toast.success('操作成功!');
    }
  }

  fetchOrder = async orderNo => {
    try {
      return await proxy(webapi.order.detailSalesOrder(orderNo));
    } catch (err) {
      console.error(err);

      return err;
    }
  };
  @action
  setOrder(order) {
    order = transformSaleOrder(order);
    const { originalPayableAmount, payableAmount, paidAmount } = order;
    this.setForm({
      no: order.no,
      goods: order.orderDetailList.map(item => item.imgPath),
      originalPayableAmount: originalPayableAmount.toFixed(2),
      payableAmount: payableAmount.toFixed(2),
      paidAmount: paidAmount ? paidAmount.toFixed(2) : '0.00',
      pay: '0.00',
    });
  }

  async getPaymentCodeSalesOrder() {
    const orderNo = this.form.no;

    return await proxy(webapi.order.getPaymentCodeSalesOrder(orderNo));
  }
  async submit(data) {
    const orderNo = this.form.no;

    return await proxy(webapi.order.confirmPaymentSalesOrder(orderNo, data));
  }

  @action
  reset() {
    this.tab = TAB_PAY;
    this.form = formStoreKeys;
  }
}
const store = new Store();
export default store;
