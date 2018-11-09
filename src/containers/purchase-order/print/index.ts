import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { toJS } from 'mobx';
import agencyStore from '../../../services/agency/store';
import lodopStore from '../../../services/lodop/store';
import settingStore from '../../../services/setting/store';
import { sunmiPrint } from '../../../services/sunmi';
import userStore from '../../../services/user/store';
import { PRINTER_TYPE_AO, PRINTER_TYPE_SUNMI } from '../../setting/constant';
import getPrintHtml from './print-html';
import getSunmiPrintData from './print-sunmi';
/**
 * 采购订单打印
 * @export purchaseOrderPrint
 * @param {*} order 采购订单数据
 * @returns {void}
 */
export default function purchaseOrderPrint(order) {
  const { setting } = settingStore;
  const { agency } = agencyStore;
  switch (setting.printerType) {
    case PRINTER_TYPE_AO:
      lodopStore.print(
        getPrintHtml(order, {
          shop: toJS(userStore.user.shop),
          agency,
        })
      );
      break;
    case PRINTER_TYPE_SUNMI:
      sunmiPrint(
        getSunmiPrintData(order, {
          shop: toJS(userStore.user.shop),
          agency,
        })
      );
      break;
    default:
      Toast.fail('未知打印类型, 请检查打印设置');
  }
}
