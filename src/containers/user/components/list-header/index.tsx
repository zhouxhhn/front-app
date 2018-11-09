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
const UserListHeader = () => {
  return (
    <Container>
      <Item flex={1} align="left">
        员工编号
      </Item>
      <Item flex={2}>姓名</Item>
      <Item flex={1}>工号</Item>
      <Item flex={2}>状态</Item>
      <Item flex={5}>权限角色</Item>
      <Item flex={4}>操作</Item>
    </Container>
  );
};
export default UserListHeader;
