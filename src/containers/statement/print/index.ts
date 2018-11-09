import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { toJS } from 'mobx';
import lodopStore from '../../../services/lodop/store';
import settingStore from '../../../services/setting/store';
import { sunmiPrint } from '../../../services/sunmi';
import userStore from '../../../services/user/store';
import { PRINTER_TYPE_AO, PRINTER_TYPE_SUNMI } from '../../setting/constant';
import getPrintHtml from './print-html';
import getSunmiPrintData from './print-sunmi';
/**
 * 流水打印
 * @export statementPrint
 * @param {*} title 标题
 * @param {*} activeIndex 当前页索引
 * @param {*} data 数据源
 * @returns {void}
 */
export default function statementPrint(title, activeIndex, data) {
  const { setting } = settingStore;
  switch (setting.printerType) {
    case PRINTER_TYPE_AO:
      lodopStore.print(
        getPrintHtml(toJS(userStore.user), { title, activeIndex, data })
      );
      break;
    case PRINTER_TYPE_SUNMI:
      sunmiPrint(
        getSunmiPrintData(toJS(userStore.user), { title, activeIndex, data })
      );
      break;
    default:
      Toast.fail('未知打印类型, 请检查打印设置');
  }
}
