import math from '@sipin/basic-libs/lib/js/math';
import moment from 'moment';

export const taskType = function(type: number | string): any {
  let text = '';
  switch (+type) {
    case 0:
      text = '满减券';
      break;
    case 1:
      text = '折扣券';
      break;
  }

  return text;
};

export const requirement = function(
  type: number | string,
  threshold: string
): any {
  let text = '';
  switch (+type) {
    case 0:
      text = '无限制';
      break;
    case 1:
      text = '满' + threshold + '元';
      break;
  }

  return text;
};

export const formatTime = function(time: string): any {
  if (!time) {
    return '';
  }
  time = time.split(' ')[0].replace(/-/g, '.');

  return time;
};

export const formatPrice = function(
  type: number | string,
  price: number | string
): any {
  let text = '';
  switch (+type) {
    case 0:
      text = String(price);
      break;
    case 1:
      text = math.Mul(+price, 10, 1);
      break;
  }

  return text;
};
export const formatPriceText = function(
  type: number | string,
  price: number | string
): any {
  let text = '';
  switch (+type) {
    case 0:
      text = '￥' + math.Add(+price, 0, 2) + '';
      break;
    case 1:
      text = math.Mul(+price, 10, 1) + '折';
      break;
  }

  return text;
};

const transCoupon = (item: any): any => {
  const start = formatTime(item.task.validTimeStartAt);
  const end = formatTime(item.task.validTimeEndAt);
  let disabled = false;
  const current = moment();
  if (start && current.isBefore(item.task.validTimeStartAt)) {
    disabled = true;
  }
  if (end && current.isAfter(item.task.validTimeEndAt)) {
    disabled = true;
  }
  if (String(item.status) !== '0') {
    disabled = true;
  }

  return {
    id: item.code,
    code: item.code,
    name: item.task.name,
    summary: item.task.summary,
    start,
    end,
    reason: '',
    taskType: taskType(item.task.discountType),
    requirement: requirement(item.task.requirement, item.task.threshold),
    price: formatPrice(item.task.discountType, item.task.value),
    priceText: formatPrice(item.task.discountType, item.task.value),
    disabled,
    goodsSkuNo: item.task.goodsSkuNo,
    goodsSkuSn: item.task.goodsSkuSn,
    requirementType: item.task.requirement,
    value: item.task.value,
    discountType: String(item.task.discountType),
  };
};

export const transCouponList = (data: any): any => {
  return (data || []).map(transCoupon);
};
