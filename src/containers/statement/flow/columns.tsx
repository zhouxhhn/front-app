import math from '@sipin/basic-libs/lib/js/math';
import formatDate from '../../../utils/date-format';

export default [
  {
    title: '流水交易号',
    dataIndex: 'paymentNo',
  },
  {
    title: '交易时间',
    dataIndex: 'paidAt',
    render: value => formatDate(value),
  },
  {
    title: '类型',
    dataIndex: 'exchangeType',
  },
  {
    title: '交易方式',
    dataIndex: 'exchangeMode',
  },
  {
    title: '交易金额',
    dataIndex: 'realReceivePrice',
    render: value => `￥ ${math.Div(value, 1, 2)}`,
  },
  {
    title: '操作员',
    dataIndex: 'operator',
  },
];
