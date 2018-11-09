import React from 'react';
import { PickerTrigger } from '@sipin/sipin-sales-cloud-components/src/components';
import { DatePicker } from 'antd-mobile';

/**
 * 日期选择器
 *
 * @param {*} props props
 * @returns {*} any
 */
export default function DayPicker(props: any): any {
  const { onChange, minDate, maxDate, value } = props;

  return (
    <DatePicker
      mode="date"
      minDate={minDate}
      maxDate={maxDate}
      onChange={onChange}
      value={value}
    >
      <PickerTrigger border={2} />
    </DatePicker>
  );
}
