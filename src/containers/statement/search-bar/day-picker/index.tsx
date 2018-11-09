import React from 'react';
import { CommonPicker } from '@sipin/sipin-sales-cloud-components/src/components';

const data = [
  {
    label: '不指定',
    value: 'default',
  },
  {
    label: '当天',
    value: 'today',
  },
  {
    label: '昨天',
    value: 'yesterday',
  },
  {
    label: '上周',
    value: 'lastWeek',
  },
  {
    label: '上月',
    value: 'lastMonth',
  },
];

/**
 * 天选择器
 *
 * @param {*} props 参数
 * @returns {*} any
 */
export default function DayPicker(props: any): any {
  const { onChange, value } = props;

  return (
    <CommonPicker border={2} options={data} value={value} onChange={onChange} />
  );
}
