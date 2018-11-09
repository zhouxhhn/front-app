import React from 'react';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import Block from './block';

interface IProps {
  receivePaymentList: any[];
  backPaymentList: any[];
}

interface IState {}

class Sum extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { receivePaymentList, backPaymentList } = this.props;

    return (
      <Flex
        style={{
          width: '100%',
        }}
      >
        <Flex.Item style={{ paddingRight: 30 }}>
          <Block title="收款" data={receivePaymentList} />
        </Flex.Item>
        <Flex.Item style={{ paddingLeft: 30 }}>
          <Block title="退款" data={backPaymentList} />
        </Flex.Item>
      </Flex>
    );
  }
}

export default Sum;
