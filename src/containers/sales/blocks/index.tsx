import React from 'react';
import { Block } from '../../../components/block';

export const LeftBlock = (props: any): any => {
  const { children } = props;

  return (
    <Block flex={640} border={1}>
      {children}
    </Block>
  );
};

export const RightBlock = (props: any): any => {
  const { children } = props;

  return (
    <Block
      flex={360}
      border={0}
      style={{ height: '100%', backgroundColor: '#fff' }}
    >
      {children}
    </Block>
  );
};
