import * as React from 'react';
import math from '@sipin/basic-libs/lib/js/math';
import { View, Text } from 'react-native';
import { mainColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import { DEFAULT_GOODS_IMG_URL } from '../../../utils/constants';
import Table from '../../../components/table';
import GoodsInfo from '../../../components/goods-list/goods-info';
import * as $style from '../../../utils/styles';
import Tag from '../../../components/tag';
import { transformGoodsSpecification } from '../../../utils';

class DetailGoodsList extends React.Component<any> {
  renderTable = (data = []) => {
    const columns = [
      {
        title: '商品',
        dataIndex: 'name',
        key: 'name',
        width: 3,
        render(value, record) {
          return (
            <GoodsInfo
              title={[value, record.skuNo]}
              descrtiption={transformGoodsSpecification(record)}
              cover={record.imgPath || DEFAULT_GOODS_IMG_URL}
              price={math.Div(record.originalAmount, 1, 2)}
            />
          );
        },
      },
      {
        title: '',
        dataIndex: 'pickup',
        key: 'pickup',
        width: 1,
        render(value, record) {
          const gift = record.gift ? (
            <View style={{ marginBottom: 5 }}>
              <Tag color="red" active>
                赠品
              </Tag>
            </View>
          ) : null;

          const pickup = !record.pickup ? (
            <View>
              <Tag color="blue" active>
                寄送
              </Tag>
            </View>
          ) : null;

          const returnItem = record.return ? (
            <View>
              <Tag color="gray" active>
                退货
              </Tag>
            </View>
          ) : null;

          return (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              {gift}
              {pickup}
              {returnItem}
            </View>
          );
        },
      },
      {
        title: (
          <Text style={[$style.style.fb, $style.style.f14]}>
            现价(
            <Text style={{ color: mainColor }}>￥</Text>)
          </Text>
        ),
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        width: 1,
        style: $style.style.flexCenterMiddle,
        render(value) {
          return `￥ ${math.Div(value, 1, 2)}`;
        },
      },
      {
        title: '订购数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 1,
        style: $style.style.flexCenterMiddle,
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

    if (!order) {
      return null;
    }

    return this.renderTable(order.orderDetailList);
  }
}

export default DetailGoodsList;
