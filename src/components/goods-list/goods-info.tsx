import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import {
  mainColor,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import {
  Cover,
  Flex,
  Price,
} from '@sipin/sipin-sales-cloud-components/src/components';
// eslint-disable-next-line

const StyledTitle = styled.Text`
  color: ${textColorMain};
  font-size: 14;
`;

const StyledDescription = styled.Text`
  color: ${textColorMain};
  font-size: 12;
`;

export interface IGoodsInfoProps {
  cover: string;
  title: string[];
  descrtiption: string;
  price?: string;
  titleStyle?: any;
}

class GoodsInfo extends React.PureComponent<IGoodsInfoProps, {}> {
  static defaultProps = {
    title: [],
    cover: '',
  };

  render() {
    const { title, cover, descrtiption, price, titleStyle } = this.props;
    const hasPrice = typeof price !== 'undefined';
    const imgSize = hasPrice ? 74 : 60;

    return (
      <Flex>
        <Cover
          height={imgSize}
          width={imgSize}
          style={{ marginRight: 20 }}
          src={cover}
        />
        <Flex.Item flex={4}>
          {title.map((text: string) => {
            return (
              <View key={text}>
                <StyledTitle style={titleStyle}>{text}</StyledTitle>
              </View>
            );
          })}
          <View style={{ marginTop: hasPrice ? 4 : 10 }}>
            <StyledDescription>{descrtiption}</StyledDescription>
          </View>
          {hasPrice ? (
            <View style={{ marginTop: 10 }}>
              <Price size={12} color={mainColor} value={price} />
            </View>
          ) : null}
        </Flex.Item>
      </Flex>
    );
  }
}

export default GoodsInfo;
