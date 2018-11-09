import * as React from 'react';
import styled from 'styled-components/native';
import {
  textColorBase,
  borderColorBase,
  textColorMain,
  mainColor,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import {
  ModalFormFieldContainer,
  ModalFormFieldWrapper,
  Flex,
} from '@sipin/sipin-sales-cloud-components/src/components';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';

const Label = styled.Text`
  width: 90;
  color: ${textColorBase};
  text-align: right;
`;

const ButtonWrap = styled.TouchableOpacity`
  margin-right: 12;
`;
const Button = styled.Text<any>`
  width: 72;
  line-height: 28;
  border-color: ${({ color }) => color || borderColorBase};
  border-style: solid;
  border-width: 2;
  border-radius: 6;
  text-align: center;
  color: ${({ color }) => color || textColorMain};
`;
class Picker extends React.Component<any> {
  static defaultProps = {
    onChange: () => {},
  };
  state = {};
  render() {
    const { label, onChange, options, value } = this.props;

    return (
      <ModalFormFieldContainer justify="center">
        <Label>{label}:</Label>
        <ModalFormFieldWrapper>
          <Flex>
            {options.map(item => {
              return (
                <ButtonWrap
                  key={item.value}
                  {...clickEvent(() => onChange(item.value))}
                >
                  <Button color={value === item.value ? mainColor : undefined}>
                    {item.label}
                  </Button>
                </ButtonWrap>
              );
            })}
          </Flex>
        </ModalFormFieldWrapper>
      </ModalFormFieldContainer>
    );
  }
}

export default Picker;
