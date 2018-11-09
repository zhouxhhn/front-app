import * as React from 'react';
import styled from 'styled-components/native';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import {
  CommonPicker,
  Flex,
} from '@sipin/sipin-sales-cloud-components/src/components';

const Container = styled.View`
  width: 100%;
  border-bottom-width: 1;
  border-style: solid;
  border-color: ${borderColorBase};
`;

const FlexItem = styled(Flex.Item)<any>`
  border-right-width: ${({ border }) => border || 0};
  border-style: solid;
  border-color: ${borderColorBase};
  padding-left: 10;
  padding-right: 10;
  padding-top: 10;
  padding-bottom: 10;
  height: 49;
`;

export interface HeaderProps {
  sellers: any[];
  sellerId: string;
  onChange: (value: any) => void;
}
const Header = ({ sellers = [], sellerId, onChange }: HeaderProps) => {
  return (
    <Container>
      <Flex>
        <FlexItem>
          <CommonPicker
            label="选择导购:"
            border={0}
            options={sellers}
            value={sellerId}
            onChange={onChange}
          />
        </FlexItem>
      </Flex>
    </Container>
  );
};

export default Header;
