import * as React from 'react';
import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import { textColorMain } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import { TouchableOpacity } from 'react-native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import GoodsInfo from '../../../components/goods-list/goods-info';
import { transformGoodsSpecification } from '../../../utils';

const Container = styled.ScrollView`
  width: 100%;
  padding-top: 10;
  padding-bottom: 10;
  padding-left: 20;
  padding-right: 20;
`;

const Item = styled(Flex)`
  margin-bottom: 36;
`;

const Quantity = styled.Text`
  color: ${textColorMain};
  font-size: 12;
  width: 40;
  text-align: right;
`;

const CartList = ({ data, goToCartPage = () => void 0 }: any) => {
  const list = data.map(item => {
    return (
      <Item key={item.uuid}>
        <Flex.Item>
          <GoodsInfo
            title={[`货号: ${item.number}`, item.name]}
            descrtiption={transformGoodsSpecification(item)}
            price={item.price}
            cover={item.imgPath}
            titleStyle={{ fontSize: 12 }}
          />
        </Flex.Item>
        <Quantity>x{item.quantity}</Quantity>
      </Item>
    );
  });

  return (
    <Container>
      <TouchableOpacity {...clickEvent(goToCartPage)}>{list}</TouchableOpacity>
    </Container>
  );
};

export default CartList;
