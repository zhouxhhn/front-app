import { line, renderTwoCol } from '../../../services/sunmi';
import formatDate from '../../../utils/date-format';

/**
 * 输出商米打印数据
 * @export getSunmiPrintData
 * @param {*} order 订单
 * @param {*} { title, activeIndex， data } 标题 当前页 数据源
 * @returns {*} 打印数据
 */
export default function getSunmiPrintData(
  { shop },
  { title = '', activeIndex, data }
) {
  let listA: any = [];
  let listB: any = [];
  let listC: any = [];

  if (activeIndex === 0) {
    listA = [
      {
        type: 'table',
        fontSize: 24,
        align: ['left', 'left', 'left'],
        width: [25, 10, 10],
        data: [['收款', '', '']],
      },
      line,
      {
        type: 'table',
        fontSize: 24,
        align: ['left', '', 'right'],
        width: [25, 10, 10],
        data: data.receivePaymentList.map(item => {
          return [
            `${item.type}:￥${item.price.toFixed(2)}`,
            '',
            `${item.total}笔`,
          ];
        }),
      },
      line,
    ];
    listB = [
      {
        type: 'table',
        fontSize: 24,
        align: ['left', 'left', 'left'],
        width: [25, 10, 10],
        data: [['退款', '', '']],
      },
      line,
      {
        type: 'table',
        fontSize: 24,
        align: ['left', '', 'right'],
        width: [25, 10, 10],
        data: data.backPaymentList.map(item => {
          return [
            `${item.type}:￥${item.price.toFixed(2)}`,
            '',
            `${item.total}笔`,
          ];
        }),
      },
      line,
    ];
  } else {
    const table = data.dataSource.map(item => {
      return {
        type: 'table',
        fontSize: 24,
        align: ['left', 'right'],
        width: [25, 20],
        data: [
          [
            `￥${(item.realReceivePrice || 0).toFixed(2)}`,
            `${item.exchangeMode}`,
          ],
          ['', `${formatDate(item.paidAt)}`],
        ],
      };
    });

    listC = [...table, line];
  }

  return [
    {
      type: 'text',
      align: 'center',
      fontSize: 35,
      data: '斯品家居',
    },
    {
      type: 'empty',
      data: 1,
    },
    {
      type: 'text',
      align: 'center',
      fontSize: 24,
      data: shop.name,
    },
    {
      type: 'text',
      align: 'center',
      fontSize: 20,
      data: title,
    },
    line,
    ...listA,
    ...listB,
    ...listC,
    {
      type: 'empty',
      data: 2,
    },
    renderTwoCol(['合计', `共${data.totalCount}笔，￥${data.totalPrice}`]),
    renderTwoCol(['日期', `${formatDate(new Date())}`]),
    {
      type: 'empty',
      data: 5,
    },
  ];
}
