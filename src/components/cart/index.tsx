import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  textColorBase,
  textColorMain,
  linkColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';

export const DataWrap = styled(Flex)`
  margin-right: 16;
`;

export const Label = styled.Text`
  color: ${textColorBase};
`;

export const Value = styled.Text`
  color: ${textColorMain};
`;

export const EmptyCartText = styled.Text`
  padding-left: 10;
  padding-right: 10;
  color: ${linkColor};
  text-align: right;
`;
