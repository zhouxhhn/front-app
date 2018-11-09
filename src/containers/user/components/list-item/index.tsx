import * as React from 'react';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import {
  mainColor,
  borderColorBase,
  textColorMain,
  colorGreen,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import { USER_STATUS } from '../../constants';
import webapi from '../../../../utils/webapi';
import isSuccess from '../../../../services/utils/is-success';
import formStore from '../form/store';

const Container = styled(Flex)`
  padding-left: 20;
  padding-right: 20;
`;
const Item = styled.Text<any>`
  flex: ${({ flex }) => flex};
  text-align: ${({ align }) => align || 'center'};
  line-height: 54;
  color: ${textColorMain};
`;
const ActionWrap = styled(Flex)`
  height: 54;
  flex: 4;
`;
const ButtonWrap = styled.TouchableOpacity`
  margin-right: 12;
`;
const Button = styled.Text<any>`
  min-width: 72;
  line-height: 32;
  border-color: ${borderColorBase};
  border-style: solid;
  border-width: 2;
  border-radius: 6;
  text-align: center;
  color: ${({ color }) => color || textColorMain};
`;
const UserListItem = ({ data, store, modal, app }: any) => {
  return (
    <Container>
      <Item flex={1} align="left">
        {data.code}
      </Item>
      <Item flex={2}>{data.name}</Item>
      <Item flex={1}>{data.empno}</Item>
      <Item flex={2}>{USER_STATUS[data.status]}</Item>
      <Item flex={5}>
        {(data.roleList || []).map(item => item.name).join(',')}
      </Item>
      <ActionWrap justify="center">
        <ButtonWrap>
          <Button
            {...clickEvent(() => {
              formStore.setForm({
                id: data.id,
                empno: data.empno,
                name: data.name,
                password: '',
              });
              modal.open();
            })}
          >
            修改
          </Button>
        </ButtonWrap>
        <ButtonWrap>
          <Button {...clickEvent(() => app.push(`/user/${data.id}/role`))}>
            绑定角色
          </Button>
        </ButtonWrap>
        <ButtonWrap>
          <Button
            color={data.status === 0 ? colorGreen : mainColor}
            {...clickEvent(async () => {
              const res = await webapi.salesMember.salesFrontUserSetStatus(
                data.id
              );
              if (isSuccess(res)) {
                Toast.success('状态修改成功');
                const dataSource = store.dataSource.map(item => {
                  if (item.id === data.id) {
                    return {
                      ...item,
                      status: 1 - item.status,
                    };
                  }

                  return item;
                });

                store.setDataSource(dataSource);
              }
            })}
          >
            {USER_STATUS[1 - data.status]}
          </Button>
        </ButtonWrap>
      </ActionWrap>
    </Container>
  );
};
export default UserListItem;
