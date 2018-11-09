import * as React from 'react';
import { Modal } from 'antd-mobile';
import { ListPanel } from '@sipin/sipin-sales-cloud-components/src/components';
import math from '@sipin/basic-libs/lib/js/math';
import agencyStore from '../../../services/agency/store';
import store from '../store';

/**
 * 采购订单支付
 * @export purchasePayment
 * @param {*} order 订单
 * @param {function} successCb callback
 * @param {function} cancelCb callback
 * @returns {void}
 */
export default function purchasePayment(
  order,
  successCb,
  cancelCb = () => void 0
) {
  const { agency } = agencyStore;
  Modal.alert(
    '确认采购',
    <ListPanel
      rowMargin={10}
      data={[
        {
          label: '本次采购金额：',
          value: `￥${(+order.amount).toFixed(2)}`,
        },
        {
          label: '采购后余额：',
          value: `￥${math.Sub(agency.balance, order.amount, 2)}`,
        },
      ]}
    />,
    [
      { text: '取消', onPress: () => cancelCb && cancelCb() },
      {
        text: '确定',
        onPress: async () => {
          await store.pay(order);
          successCb && successCb();
        },
      },
    ]
  );
}
