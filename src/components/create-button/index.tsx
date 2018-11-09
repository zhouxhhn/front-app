import * as React from 'react';
import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import { mainColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';

const Button = styled.TouchableOpacity`
  width: 64;
  height: 64;
  border-radius: 64;
  background-color: ${mainColor};
  position: absolute;
  right: 24;
  bottom: 24;
`;
const ButtonIcon = styled.Text`
  flex: 22;
  text-align: center;
  line-height: 64;
  color: #fff;
`;
const ButtonText = styled.Text`
  flex: 42;
  text-align: left;
  line-height: 16;
  padding-top: 16;
  padding-bottom: 16;
  padding-right: 4;
  color: #fff;
`;
const CreateButton = ({ children, ...props }) => (
  <Button {...props}>
    <Flex>
      <ButtonIcon>+</ButtonIcon>
      <ButtonText>{children}</ButtonText>
    </Flex>
  </Button>
);
export default CreateButton;
