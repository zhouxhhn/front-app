import * as React from 'react';
import styled from 'styled-components/native';
import {
  borderColorBase,
  mainColor,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import Icon from '@sipin/sipin-sales-cloud-components/src/components/iconfont';
import { View } from 'react-native';
import { isWeb } from '../../utils';

const Wrap = (isWeb ? styled.View : styled.TouchableOpacity)`
  border-width: 2;
  border-style: solid;
  border-color: ${borderColorBase};
  border-radius: 20;
  padding-top: 10;
  padding-bottom: 10;
`;
const TextWrap = styled.Text`
  text-align: center;
  color: ${textColorMain};
`;
const StyledIcon = styled(Icon)`
  margin-bottom: 6;
`;
const Label = styled.Text`
  font-size: 12;
`;

const CartButton = ({ label = '加入购物车', ...rest }: any) => {
  return (
    <Wrap {...rest}>
      <View>
        <TextWrap>
          <StyledIcon name="cart" size={24} color={mainColor} />
        </TextWrap>
      </View>
      <TextWrap>
        <Label>{label}</Label>
      </TextWrap>
    </Wrap>
  );
};

export default CartButton;
