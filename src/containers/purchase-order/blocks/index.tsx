import React from 'react';
import { Block } from '../../../components/block';

export const LeftBlock = (props: any): any => {
  const { children } = props;

  return (
    <Block flex={363} border={1}>
      {children}
    </Block>
  );
};

export const CenterBlock = (props: any): any => {
  const { children } = props;

  return (
    <Block flex={677} border={4}>
      {children}
    </Block>
  );
};

export const RightBlock = (props: any): any => {
  const { children } = props;

  return <Block flex={240}>{children}</Block>;
};
