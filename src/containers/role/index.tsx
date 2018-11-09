import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import List from './list';

const Basic = styled.View`
  height: 100%;
  background-color: #fff;
`;
const Container = styled(Basic)`
  flex: 677;
`;
class Role extends Component<any> {
  state = {};
  render() {
    const { app } = this.props;

    return (
      <Flex style={{ height: '100%' }}>
        <Container>
          <List app={app} />
        </Container>
      </Flex>
    );
  }
}

export default Role;
