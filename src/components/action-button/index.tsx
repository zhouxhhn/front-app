import React from 'react';
import styled from 'styled-components/native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import {
  borderColorBase,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';

const ActionButtonWrapper = styled.TouchableOpacity`
  width: 80;
  border-width: 2;
  border-color: ${borderColorBase};
  border-radius: 10;
`;
const ActionButtonText = styled.Text`
  font-size: 12;
  color: ${textColorMain};
  text-align: center;
  height: 28;
  line-height: 28;
`;

const ActionButton = (props: any): any => {
  const { children, onClick } = props;

  return (
    <ActionButtonWrapper {...clickEvent(onClick)}>
      <ActionButtonText>{children}</ActionButtonText>
    </ActionButtonWrapper>
  );
};

export default ActionButton;
