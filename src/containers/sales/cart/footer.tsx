import * as React from 'react';
import {
  Button,
  Flex,
} from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import {
  EmptyCartText,
  DataWrap,
  Label,
  Value,
} from '../../../components/cart';
import { isWeb } from '../../../utils';

const Container = styled.View`
  width: 100%;
  border-top-width: 1;
  border-style: solid;
  border-color: ${borderColorBase};
  padding-top: 10;
  padding-bottom: 26;
  padding-left: 20;
  padding-right: 20;
`;

const ButtonWrap = styled.View`
  width: 200;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24;
`;

export interface FooterProps {
  data: any[];
  onSubmit: () => void;
  onEmptyCart: () => void;
}

const Footer = ({
  data,
  onSubmit = () => void 0,
  onEmptyCart,
}: FooterProps) => {
  const dataNodes = data.map(item => (
    <DataWrap key={item.label}>
      <Label>{item.label}</Label>
      <Value>{item.value}</Value>
    </DataWrap>
  ));

  const btnWrapProps = isWeb ? { ...clickEvent(onSubmit) } : {};
  const btnProps = isWeb ? {} : { ...clickEvent(onSubmit) };

  return (
    <Container>
      <Flex>
        {dataNodes}
        <Flex.Item>
          <EmptyCartText {...clickEvent(onEmptyCart)}>
            | 清空购物车
          </EmptyCartText>
        </Flex.Item>
      </Flex>
      <ButtonWrap {...btnWrapProps}>
        <Button type="primary" {...btnProps}>
          提交
        </Button>
      </ButtonWrap>
    </Container>
  );
};

export default Footer;
