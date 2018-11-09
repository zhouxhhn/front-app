import * as React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@sipin/sipin-sales-cloud-components/src/components';
import {
  mainColor,
  borderColorBase,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';

const Wrap = styled.View<any>`
  width: 16;
  height: 16;
  background-color: ${({ background }) => background};
  border-color: ${({ border }) => border};
  border-style: solid;
  border-width: 2;
  border-radius: 16;
  margin-top: 8;
  margin-bottom: 8;
  margin-left: 8;
  margin-right: 8;
`;

const Checkbox = ({ value, onChange = () => void 0 }: any) => {
  return (
    <TouchableOpacity {...clickEvent(() => onChange(!value))}>
      <Wrap
        background={value ? mainColor : '#fff'}
        border={value ? mainColor : borderColorBase}
      >
        <Icon name="selected" size={12} color="#fff" />
      </Wrap>
    </TouchableOpacity>
  );
};

export default Checkbox;
