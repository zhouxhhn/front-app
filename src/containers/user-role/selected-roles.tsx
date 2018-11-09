import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import styled from 'styled-components/native';
import Tag from './components/tag';

const Container = styled.ScrollView`
  padding-top: 32;
  padding-left: 2;
  padding-right: 2;
`;
const FormWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;
const FlexItem = styled.View`
  width: 160;
`;

@observer
class SelectedRoles extends React.Component<any> {
  state = {};
  renderTags() {
    const { store } = this.props;

    const data = toJS(store.userRoles);
    const len = data.length;
    if (!len) {
      return [];
    }
    const nodes: any[] = [];
    for (let i = 0; i < len; i = i + 3) {
      const row = [i, i + 1, i + 2];
      const items: any[] = row.map(n => {
        if (n < len) {
          const item = data[n];

          return (
            <FlexItem key={item.id}>
              <Tag
                label={item.name}
                {...clickEvent(() => {
                  store.setStore(
                    'userRoles',
                    data.filter(r => r.id !== item.id)
                  );
                })}
              />
            </FlexItem>
          );
        } else {
          return <FlexItem key={n} />;
        }
      });
      nodes.push(<FormWrap key={i}>{items}</FormWrap>);
    }

    return nodes;
  }
  render() {
    return <Container>{this.renderTags()}</Container>;
  }
}

export default SelectedRoles;
