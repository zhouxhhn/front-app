import * as React from 'react';
import math from '@sipin/basic-libs/lib/js/math';
import { View, Text } from 'react-native';
import { mainColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import { DEFAULT_GOODS_IMG_URL } from '../../../utils/constants';
import Table from '../../../components/table';
import * as $style from '../../../utils/styles';
import { transformGoodsSpecification } from '../../../utils';
import GoodsInfo from '../../../components/goods-list/goods-info';

class Goods extends React.Component<any> {
  renderTable = (data = []) => {
    const columns = [
      {
        title: '商品',
        key: 'name',
        width: 3,
        render(record) {
          return (
            <GoodsInfo
              title={[record.name, record.skuNo]}
              descrtiption={transformGoodsSpecification(record)}
              cover={record.imgPath || DEFAULT_GOODS_IMG_URL}
              price={math.Div(record.salesPrice, 1, 2)}
            />
          );
        },
      },
      {
        title: (
          <Text style={[$style.style.fb, $style.style.f14]}>
            退款金额(
            <Text style={{ color: mainColor }}>￥</Text>)
          </Text>
        ),
        dataIndex: 'refundedAmount',
        key: 'refundedAmount',
        width: 1,
      },
      {
        title: '退货数量',
        dataIndex: 'refundedQuantity',
        key: 'refundedQuantity',
        width: 1,
      },
    ];

    return (
      <View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
        <Table columns={columns} data={data} rowKey={r => r.id} />
      </View>
    );
  };
  render() {
    const { order } = this.props;

    return (order && this.renderTable(order.returnOrderDetailVos)) || null;
  }
}

export default Goods;
