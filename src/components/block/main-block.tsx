import React from 'react';
import styled from 'styled-components/native';

const StyledMainBlock = styled.View``;

const MainBlock = (props: any): any => {
  const { children, ...rest } = props;

  return (
    <StyledMainBlock style={{ height: '100%' }} {...rest}>
      {children}
    </StyledMainBlock>
  );
};

export default MainBlock;
