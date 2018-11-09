import * as React from 'react';
import { observer } from 'mobx-react/native';
import { toJS } from 'mobx';
import styled from 'styled-components/native';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import Switch from './switch';
import isSuccess from '../../services/utils/is-success';

const Container = styled.ScrollView`
  padding-bottom: 24;
`;
const FormWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;
const FlexItem = styled.View`
  width: 280;
  border-color: ${borderColorBase};
  border-style: dashed;
  border-bottom-width: 1;
`;
const FlexItemPlacehoder = styled.View`
  width: 280;
`;

@observer
export class PermissionForm extends React.Component<any> {
  setPermissions = async permissions => {
    const { roleId, store } = this.props;

    const ids = permissions.filter(p => !!p.status).map(p => p.id);
    const res = await store.salesFrontPermissionRoleSetRolePermission(
      roleId,
      ids
    );

    if (isSuccess(res)) {
      store.setStore('permissions', permissions);
      Toast.success('设置成功!');
    }
  };
  renderForm() {
    const {
      store,
      store: { allSelected },
    } = this.props;
    const permissions = toJS(store.permissions);
    const len = permissions.length;
    if (!len) {
      return [];
    }
    const formNodes: any = [];
    for (let i = 0; i < len; i = i + 3) {
      const row = [i, i + 1, i + 2];
      const items: any[] = row.map(n => {
        if (n < len) {
          const item = permissions[n];

          return (
            <FlexItem key={item.id}>
              <Switch
                label={item.displayName}
                value={!!item.status}
                onChange={async v => {
                  const newPermissions = permissions.map(
                    p =>
                      p.id === item.id ? { ...p, status: v ? 1 : 0 } : { ...p }
                  );
                  this.setPermissions(newPermissions);
                }}
              />
            </FlexItem>
          );
        } else {
          return <FlexItemPlacehoder key={n} />;
        }
      });
      formNodes.push(<FormWrap key={i}>{items}</FormWrap>);
    }

    const selectAll = (
      <FormWrap key={-1}>
        <FlexItem>
          <Switch
            label="全选"
            value={allSelected}
            onChange={async v => {
              const newPermissions = permissions.map(p => ({
                ...p,
                status: v ? 1 : 0,
              }));
              this.setPermissions(newPermissions);
            }}
          />
        </FlexItem>
        <FlexItemPlacehoder />
        <FlexItemPlacehoder />
      </FormWrap>
    );

    return [selectAll, ...formNodes];
  }
  render() {
    return <Container>{this.renderForm()}</Container>;
  }
}

export default PermissionForm;
