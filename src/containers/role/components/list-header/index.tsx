import * as React from 'react';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import {
  borderColorBase,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';

const Container = styled(Flex)`
  padding-left: 20;
  padding-right: 20;
  border-color: ${borderColorBase};
  border-style: solid;
  border-bottom-width: 1;
`;
const Item = styled.Text<any>`
  flex: ${({ flex }) => flex};
  text-align: ${({ align }) => align || 'center'};
  line-height: 54;
  color: ${textColorMain};
`;
const RoleListHeader = () => {
  return (
    <Container>
      <Item flex={2} align="left">
        角色编号
      </Item>
      <Item flex={2}>名称</Item>
      <Item flex={2}>类型</Item>
      <Item flex={2}>状态</Item>
      <Item flex={5}>操作</Item>
    </Container>
  );
};
export default RoleListHeader;
