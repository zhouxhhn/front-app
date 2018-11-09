import React from 'react';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import styled from 'styled-components/native';
import Basic from './base';

const StyledBlock = styled(Basic)`
  flex: ${(props: any) => (props.flex ? props.flex : 363)};
  border-right-width: ${(props: any) => (props.border ? props.border : 0)};
  border-color: ${borderColorBase};
  border-style: solid;
`;

// eslint-disable-next-line
export default function Block(props): any {
  return <StyledBlock {...props} />;
}
