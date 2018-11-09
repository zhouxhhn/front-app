import * as React from 'react';
import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  borderColorBase,
  textColorMain,
  mainColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import { Switch as AntSwitch } from 'antd-mobile';

const Container = styled(Flex)`
  border-color: ${borderColorBase};
  height: 46;
  padding-top: 10;
  padding-bottom: 10;
`;
const Label = styled.Text<any>`
  flex: 1;
  color: ${({ color }) => color || textColorMain};
  text-align: left;
  line-height: 32;
`;

class Switch extends React.Component<any> {
  static defaultProps = {
    onChange: () => {},
  };
  state = {};
  render() {
    const { label, onChange, value } = this.props;

    return (
      <Container>
        <Label>{label}</Label>
        <AntSwitch checked={value} onChange={onChange} color={mainColor} />
      </Container>
    );
  }
}

export default Switch;
