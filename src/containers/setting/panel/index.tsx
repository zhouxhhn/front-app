import * as React from 'react';
import styled from 'styled-components/native';
import { textColorMain } from '@sipin/sipin-sales-cloud-components/src/style/varibles';

const Container = styled.View`
  width: 320;
  margin-top: 60;
  margin-right: auto;
  margin-left: auto;
`;
const Title = styled.Text`
  line-height: 36;
  font-size: 18;
  text-align: center;
  color: ${textColorMain};
  margin-bottom: 24;
`;

export interface PanelProps {
  title: string;
  children: React.ReactElement<any>;
}

const Panel = ({ title, children }: PanelProps) => {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

export default Panel;
