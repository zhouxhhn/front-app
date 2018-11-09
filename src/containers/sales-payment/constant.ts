export const TAB_DISCOUNT_A = '0'; // 折扣
export const TAB_DISCOUNT_B = '1'; // 优惠
export const TAB_PAY = '3'; // 支付金额
export const TAB_DISCOUNT_OPTIONS = [
  {
    title: '折扣',
    key: TAB_DISCOUNT_A,
  },
  {
    title: '优惠金额',
    key: TAB_DISCOUNT_B,
  },
];
export const TAB_PAY_OPTIONS = [
  {
    title: '支付金额',
    key: TAB_PAY,
  },
];

export const TYPE_PAY_CASH = '0';
export const TYPE_PAY_CASH_LABEL = '现金';
export const TYPE_PAY_POS_BANK = '1';
export const TYPE_PAY_POS_BANK_LABEL = '刷卡';
export const TYPE_PAY_POS_QR = '2';
export const TYPE_PAY_POS_QR_LABEL = '扫码';
export const TYPE_PAY_POS_OTHER = '3';
export const TYPE_PAY_POS_OTHER_LABEL = '其他';

export const TYPE_PAY_OPTIONS = [
  {
    value: TYPE_PAY_CASH,
    label: TYPE_PAY_CASH_LABEL,
  },
  {
    value: TYPE_PAY_POS_BANK,
    label: TYPE_PAY_POS_BANK_LABEL,
  },
  {
    value: TYPE_PAY_POS_QR,
    label: TYPE_PAY_POS_QR_LABEL,
  },
  {
    value: TYPE_PAY_POS_OTHER,
    label: TYPE_PAY_POS_OTHER_LABEL,
  },
];
export const TYPE_PAY = {
  [TYPE_PAY_CASH]: TYPE_PAY_CASH_LABEL,
  [TYPE_PAY_POS_BANK]: TYPE_PAY_POS_BANK_LABEL,
  [TYPE_PAY_POS_QR]: TYPE_PAY_POS_QR_LABEL,
  [TYPE_PAY_POS_OTHER]: TYPE_PAY_POS_OTHER_LABEL,
};

// POS 参数
export const BUSI_SALE_BANK = 100100001; // 银行卡收款
export const BUSI_SALE_QR = 100300001; // 扫码支付收款
