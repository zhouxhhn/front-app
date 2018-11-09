import React from 'react';
import styled from 'styled-components/native';

const LinkButtonWrapper = styled.TouchableOpacity`
  width: 70;
`;
const LinkButtonText = styled.Text<any>`
  font-size: 14;
  color: #61aceb;
  text-align: ${({ align }) => align};
  height: 28;
  line-height: 28;
`;

const LinkButton = (props: any): any => {
  const { children, onClick, align = 'left' } = props;

  return (
    <LinkButtonWrapper onPress={onClick}>
      <LinkButtonText align={align}>{children}</LinkButtonText>
    </LinkButtonWrapper>
  );
};

export default LinkButton;
