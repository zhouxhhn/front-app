import React from 'react';
import styled from 'styled-components/native';
import {
  Flex,
  Cover,
} from '@sipin/sipin-sales-cloud-components/src/components';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import { MainBlock } from '../../components/block';

const Container = styled(Flex)`
  justify-content: space-between;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
  max-width: 1000;
  margin-right: auto;
  margin-left: auto;
`;

const TouchableOpacity = styled.TouchableOpacity`
  margin-top: 10;
  margin-right: 20;
  margin-bottom: 10;
  margin-left: 20;
`;

const Name = styled.Text`
  padding-top: 15;
  padding-bottom: 15;
  text-align: center;
`;

const Wrapper = styled(Flex)`
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 240;
  height: 180;
  background-color: white;
  border-radius: 10;
`;

const Trigger = ({
  icon,
  name,
  url,
  push,
}: {
  icon: string;
  name: string;
  url: string;
  push: any;
}) => (
  <TouchableOpacity {...clickEvent(() => push(url))}>
    <Wrapper>
      <Cover src={icon} width={112} height={112} />
    </Wrapper>
    <Name>{name}</Name>
  </TouchableOpacity>
);

const items = [
  {
    icon: require('./images/sale.png'),
    name: '销售开单',
    url: '/sales',
  },
  {
    icon: require('./images/purchase.png'),
    name: '采购进货',
    url: '/purchase',
  },
  {
    icon: require('./images/statment.png'),
    name: '对账',
    url: '/statement',
  },
  {
    icon: require('./images/sale-order.png'),
    name: '销售订单',
    url: '/sales-order',
  },
  {
    icon: require('./images/purchase-order.png'),
    name: '采购订单',
    url: '/purchase-order',
  },
  {
    icon: require('./images/setting.png'),
    name: '设置',
    url: '/setting',
  },
];

/**
 * Index
 *
 * @param {*} props props
 * @returns {ReactElement} Index
 */
export default function Index(props: any) {
  const {
    app: { push },
  } = props;

  return (
    <MainBlock>
      <Container>
        {items.map(item => (
          <Trigger key={item.name} push={push} {...item} />
        ))}
      </Container>
    </MainBlock>
  );
}
