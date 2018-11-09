import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  borderColorBase,
  mainColor,
  textColorMain,
  inputBackgroundColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';

export const Left = styled.View`
  margin-right: 4;
  flex: 80;
  height: 100%;
  background-color: white;
`;

export const Right = styled.View`
  flex: 20;
  height: 100%;
  background-color: white;
`;

export const Header = styled(Flex)`
  align-content: center;
  align-items: center;
  height: 49;
  padding-right: 10;
  padding-left: 10;
  border-bottom-width: 1;
  border-bottom-color: ${borderColorBase};
`;

export const HeaderText = styled.Text`
  margin-right: 20;
  font-size: 12;
`;

export const ListHeader = styled(Flex)`
  padding-top: 10;
  padding-right: 10;
  padding-bottom: 10;
  padding-left: 10;
  justify-content: space-between;
  & * {
    color: ${textColorMain};
  }
`;

export const ListHeaderText = styled.Text`
  font-size: 14;
  text-align: center;
  color: ${textColorMain};
`;

export const ListItemWrapper = styled(Flex)`
  padding-top: 10;
  padding-right: 10;
  padding-bottom: 10;
  padding-left: 10;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

export const ItemInfoWrapper = styled(Flex)`
  flex: 3;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

const itemTagColors = {
  red: '#ef6878',
  green: '#4089c7',
};

type ItemTagProps = {
  color?: string;
};

export const ItemTag = styled.Text<ItemTagProps>`
  width: 40;
  margin-bottom: 5;
  padding-top: 5;
  padding-bottom: 5;
  text-align: center;
  color: white;
  border-radius: 5;
  background-color: ${({ color }) => itemTagColors[color || 'red']};
`;

export const ItemInput = styled.TextInput`
  margin-right: 10;
  margin-left: 10;
  padding-left: 10;
  padding-right: 10;
  line-height: 35;
  border-radius: 5;
  background-color: ${inputBackgroundColor};
`;

export const HightlightText = styled.Text`
  color: ${mainColor};
`;

export const FlexItem = styled.View<{ flex: number }>`
  flex: ${props => props.flex};
`;

export const TextCenter = styled.Text`
  text-align: center;
`;

export const CheckButtonWrap = styled(Flex)`
  justify-content: space-around;
  margin-top: 10;
  margin-bottom: 10;
`;

export const TextInput = styled.TextInput`
  margin-top: 10;
  padding-top: 5;
  padding-right: 5;
  padding-bottom: 5;
  padding-left: 5;
  background-color: ${inputBackgroundColor};
  border-radius: 5;
`;
