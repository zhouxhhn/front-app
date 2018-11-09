import * as React from 'react';
import {
  Flex,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import {
  borderColorBase,
  textColorMain,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import { Modal } from 'antd-mobile';
import { ROLE_STATUS, ROLE_TYPE, ROLE_TYPE_PUBLIC } from '../../constants';
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
  flex: 5;
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
const RoleListItem = ({ data, store, modal, app }: any) => {
  return (
    <Container>
      <Item flex={2} align="left">
        {data.code}
      </Item>
      <Item flex={2}>{data.name}</Item>
      <Item flex={2}>{ROLE_TYPE[data.type]}</Item>
      <Item flex={2}>{ROLE_STATUS[data.status]}</Item>
      <ActionWrap justify="center">
        {data.type !== ROLE_TYPE_PUBLIC && (
          <>
            <ButtonWrap>
              <Button
                {...clickEvent(() => {
                  formStore.setForm({
                    id: data.id,
                    name: data.name,
                    status: data.status,
                  });
                  modal.open();
                })}
              >
                修改
              </Button>
            </ButtonWrap>
            <ButtonWrap>
              <Button
                {...clickEvent(() => app.push(`/role/${data.id}/permission`))}
              >
                绑定权限
              </Button>
            </ButtonWrap>
            <ButtonWrap>
              <Button
                {...clickEvent(async () => {
                  Modal.alert('提示', '确定删除该角色?', [
                    { text: '取消', onPress: () => {}, style: 'default' },
                    {
                      text: '确定',
                      onPress: async () => {
                        const res = await webapi.salesMember.salesFrontRolesDelete(
                          data.id
                        );
                        if (isSuccess(res)) {
                          Toast.success('删除成功');
                          store.getList({ page: 1, size: 20 });
                        }
                      },
                    },
                  ]);
                })}
              >
                删除
              </Button>
            </ButtonWrap>
          </>
        )}
      </ActionWrap>
    </Container>
  );
};
export default RoleListItem;
