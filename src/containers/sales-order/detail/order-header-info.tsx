import React from 'react';
import { Header, HeaderText, HightlightText } from '../../sales-refund/ui';

export default class OrderHeaderInfo extends React.PureComponent<any> {
  static defaultProps = {
    data: [],
  };
  renderItems() {
    const { data } = this.props;

    return data.map((item, index) => {
      const value = item.hightlight ? (
        <HightlightText>{item.value}</HightlightText>
      ) : (
        item.value
      );

      return (
        // eslint-disable-next-line
        <HeaderText key={index}>
          {item.label}: {value}
        </HeaderText>
      );
    });
  }

  render() {
    const { children } = this.props;

    return (
      <Header>
        {this.renderItems()}
        {children}
      </Header>
    );
  }
}
