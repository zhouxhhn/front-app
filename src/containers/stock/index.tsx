import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import PurchaseGoodsList from './list';

const Basic = styled.View`
  height: 100%;
  background-color: #fff;
`;
const Container = styled(Basic)`
  flex: 677;
`;

class Home extends Component {
  constructor(props: any) {
    super(props);
  }
  async componentWillMount() {}
  render() {
    return (
      <Flex style={{ height: '100%' }}>
        <Container>
          <PurchaseGoodsList />
        </Container>
      </Flex>
    );
  }
}

export default Home;
