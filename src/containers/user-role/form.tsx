import * as React from 'react';
import { observer } from 'mobx-react/native';
import { toJS } from 'mobx';
import styled from 'styled-components/native';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import Checkbox from './components/checkbox';

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
  width: 230;
  border-color: ${borderColorBase};
  border-style: dashed;
  border-bottom-width: 1;
`;
const FlexItemPlacehoder = styled.View`
  width: 230;
`;

@observer
export class RoleForm extends React.Component<any> {
  renderForm() {
    const { store } = this.props;
    const data = toJS(store.roles);
    const len = data.length;
    if (!len) {
      return [];
    }
    const formNodes: any = [];
    for (let i = 0; i < len; i = i + 2) {
      const row = [i, i + 1];
      const items: any[] = row.map(n => {
        if (n < len) {
          const item = data[n];

          return (
            <FlexItem key={item.id}>
              <Checkbox
                label={item.name}
                value={store.selectedIds.indexOf(item.id) > -1}
                onChange={async v => {
                  const userRoles = toJS(store.userRoles);
                  if (v) {
                    store.setStore('userRoles', [...userRoles, item]);
                  } else {
                    store.setStore(
                      'userRoles',
                      userRoles.filter(r => r.id !== item.id)
                    );
                  }
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

    return formNodes;
  }
  render() {
    return <Container>{this.renderForm()}</Container>;
  }
}

export default RoleForm;
