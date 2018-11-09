import * as React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Flex, Icon } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  borderColorBase,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';

const Container = styled(Flex)`
  border-width: 2;
  border-style: solid;
  border-color: ${borderColorBase};
  border-radius: 6;
  padding-left: 8;
  padding-right: 8;
  padding-top: 6;
  padding-bottom: 6;
  margin-bottom: 16;
`;
const Label = styled.Text`
  flex: 1;
  line-height: 16;
`;

const Tag = ({ label, ...props }: any) => (
  <TouchableOpacity {...props}>
    <Container align="center" justify="center">
      <Label>{label}</Label>
      <Icon name="close" size={12} color={textColorMain} />
    </Container>
  </TouchableOpacity>
);

export default Tag;
