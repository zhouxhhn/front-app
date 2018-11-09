import React from 'react';
import { Text } from 'react-native';
import {
  textColorBase,
  borderColorBase,
  mainColor,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import styled from 'styled-components/native';

const Header = styled.View`
  height: 50;
  /* line-height: 38; */
  padding-top: 10;
  padding-left: 20;
  /* font-size: 14; */
  border-bottom-width: 1;
  border-style: solid;
  border-bottom-color: ${borderColorBase};
  /* color: ${textColorMain}; */
`;

export const BlockHeaderText = styled.Text`
  font-size: 12;
  color: ${textColorMain};
`;

export const BlockHeaderName = (props: any) => {
  const { children } = props;

  return (
    <Text style={{ color: textColorBase, lineHeight: 28 }}>
      当前页：
      <Text style={{ color: mainColor }}>{children}</Text>
    </Text>
  );
};

export default Header;
