import { Toast as toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { Platform } from 'react-native';

/**
 * 调用商米打印机
 * @export
 * @param {*} data 打印数据
 * @returns {void}
 */
export default function sunmiPrint(data: any): void {
  if (Platform.OS === 'web') {
    const win: any = window;

    if (!win.sipinSalesSunmiApp) {
      toast.fail('打印服务失败.');
    } else {
      toast.success('开始打印');
      win.sipinSalesSunmiApp.sendToSunmiPrinter({
        data,
      });
    }
  }
}

/**
 * 输入左右布局
 * @export renderTwoCol
 * @param {*} data 数组, 左右文字
 * @returns {*} 打印数据
 */
export function renderTwoCol(data) {
  return {
    type: 'table',
    fontSize: 24,
    align: ['left', 'right'],
    width: [22, 23],
    data: [data],
  };
}
/**
 * 输出双列表格
 * @export renderTwoColMultiRow
 * @param {array} data []
 * @returns {*} 双列表格打印数据
 */
export function renderTwoColMultiRow(data) {
  return {
    type: 'table',
    fontSize: 24,
    align: ['left', 'right'],
    width: [22, 23],
    data,
  };
}

/**
 * 普通行文字
 *
 * @export renderRowText
 * @param {string} data 文字
 * @param {string} [align='left'] 默认居中
 * @returns {*} 行数据
 */
export function renderRowText(data, align = 'left') {
  return {
    type: 'text',
    align,
    fontSize: 24,
    data,
  };
}

export const line = {
  type: 'line',
  fontSize: 24,
  data: 48,
};
