import math from '@sipin/basic-libs/lib/js/math';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { action, computed, observable } from 'mobx';
import uuid from 'uuid';
import constants from '../../services/constants';
import isSuccess from '../../services/utils/is-success';
import proxy from '../../services/utils/proxy';
import webapi from '../../utils/webapi';
import { transformSaleOrder } from '../sales-order/utils';

const orderTransform = data => ({
  ...data,
  orderDetailList: data.orderDetailList.map(item => ({
    ...item,
    refundQuantityUpdate: 0,
    refundAmountUpdate: 0,
    uid: uuid(),
  })),
});

class SalesRefundStore {
  @observable
  order: any = { orderDetailList: [] };
  @observable
  returnType = constants.REFUND_TYPE_CASH;
  @observable
  reasonNote = '';

  submitting = false;

  @computed
  get refundAmount() {
    return this.order.orderDetailList.reduce(
      (acc, x) => math.Add(acc, x.refundAmountUpdate, 2),
      0
    );
  }

  @computed
  get refundQuantity() {
    return this.order.orderDetailList.reduce(
      (acc, x) => math.Add(acc, x.refundQuantityUpdate),
      0
    );
  }

  async getOrder(orderNo) {
    const res = await proxy(webapi.order.detailSalesOrder(orderNo));
    if (isSuccess(res)) {
      const order = transformSaleOrder(res.data);
      this.setOrder(order);
    } else {
      Toast.fail(res.msg);
    }
  }

  @action
  setOrder(order) {
    this.order = orderTransform(order);
    this.reasonNote = '';
  }

  @action
  updateQuantity(uid, quantity) {
    this.order.orderDetailList.forEach(item => {
      if (item.uid == uid) {
        item.refundQuantityUpdate = quantity;
      }
    });
  }

  @action
  updateAmount(uid, { target: { value } }) {
    this.order.orderDetailList.forEach(item => {
      if (item.uid == uid && Number(value) <= item.refundAmount) {
        item.refundAmountUpdate = value;
      }
    });
  }

  @action
  updateNote({ target: { value } }) {
    this.reasonNote = value;
  }

  @action
  updateReturnType = type => {
    this.returnType = type;
  };

  @action
  refundAll = () => {
    this.order.orderDetailList.forEach(item => {
      item.refundQuantityUpdate = item.refundQuantity;
      item.refundAmountUpdate = item.refundAmount;
    });
  };

  submit = async () => {
    if (this.submitting) {
      return;
    }
    const data = {
      orderNo: this.order.no,
      reasonNote: this.reasonNote,
      returnType: this.returnType,
      returnSkuDetails: this.order.orderDetailList
        .map(item => ({
          orderDetailNo: item.detailNo,
          quantity: item.refundQuantityUpdate || 0,
          refundedAmount: item.refundAmountUpdate || 0,
        }))
        .filter(item => item.quantity > 0 || item.refundedAmount > 0),
    };
    if (!data.reasonNote) {
      Toast.fail('退货理由必填');

      return;
    }
    if (data.returnSkuDetails.length < 1) {
      Toast.fail('退款数量、退款金额至少选填一项');

      return;
    }
    this.submitting = true;
    const res = await proxy(webapi.order.frontCreateReturnOrder(data)).catch(
      e => {
        this.submitting = false;

        return e;
      }
    );
    if (isSuccess(res)) {
      return res;
    }
    this.submitting = false;
  };
}

export default new SalesRefundStore();
