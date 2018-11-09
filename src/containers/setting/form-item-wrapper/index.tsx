import * as React from 'react';
import styled from 'styled-components/native';
import {
  Flex,
  FormItemLabel as BaseFormItemLabel,
} from '@sipin/sipin-sales-cloud-components/src/components';

const StyledFlex = styled(Flex)`
  margin-bottom: 24;
`;

const FormItemLabel = styled(BaseFormItemLabel)`
  line-height: 32;
  margin-right: 10;
`;

export default class FormItemWrapper extends React.PureComponent<any> {
  render() {
    const { label, ...rest } = this.props;

    return (
      <StyledFlex>
        <FormItemLabel width="80">{label}</FormItemLabel>
        <Flex.Item {...rest} />
      </StyledFlex>
    );
  }
}
