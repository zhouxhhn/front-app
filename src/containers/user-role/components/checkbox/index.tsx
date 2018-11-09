import * as React from 'react';
import styled from 'styled-components/native';
import { Flex } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  borderColorBase,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import Checkbox from './checkbox';

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
    const { label, onChange = () => void 0, value = false } = this.props;

    return (
      <Container>
        <Label>{label}</Label>
        <Checkbox value={!!value} onChange={onChange} />
      </Container>
    );
  }
}

export default Switch;
