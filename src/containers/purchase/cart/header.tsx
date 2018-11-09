import * as React from 'react';
import styled from 'styled-components/native';
import {
  borderColorBase,
  textColorMain,
  mainColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import {
  Flex,
  FormItemLabel,
  Icon,
  Price,
} from '@sipin/sipin-sales-cloud-components/src/components';

const Container = styled.View`
  width: 100%;
  border-bottom-width: 1;
  border-style: solid;
  border-color: ${borderColorBase};
  padding-top: 20;
  padding-bottom: 14;
`;

const FlexItem = styled(Flex.Item)<any>`
  border-right-width: ${({ border }) => border || 0};
  border-style: solid;
  border-color: ${borderColorBase};
`;

const Value = styled.Text`
  color: ${textColorMain};
  margin-left: 10;
`;

const Row = styled(Flex)`
  margin-bottom: 6;
  padding-left: 20;
  padding-right: 20;
`;

const IconWrap = styled.View`
  width: 100%;
`;

const StyledIcon = styled(Icon)`
  text-align: center;
`;

const IconText = styled.Text`
  color: ${textColorMain};
  font-size: 16;
  text-align: center;
  margin-top: 10;
`;

export interface HeaderProps {
  name: string;
  grade: string;
  balance: string;
}
const Header = ({ name = '', grade = '', balance = '' }: HeaderProps) => {
  return (
    <Container>
      <Flex>
        <FlexItem flex={285} border={1}>
          <Row>
            <FormItemLabel>经销商</FormItemLabel>
            <Value>{name}</Value>
          </Row>
          <Row>
            <FormItemLabel>等级</FormItemLabel>
            <Value>{grade}</Value>
          </Row>
          <Row>
            <FormItemLabel>可用余额</FormItemLabel>
            <Value>
              <Price size={14} color={mainColor} value={balance} />
            </Value>
          </Row>
        </FlexItem>
        <FlexItem flex={85}>
          <IconWrap>
            <StyledIcon name="recharge" size={30} color={textColorMain} />
            <IconText>充 值</IconText>
          </IconWrap>
        </FlexItem>
      </Flex>
    </Container>
  );
};

export default Header;
