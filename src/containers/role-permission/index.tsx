import * as React from 'react';
import { observer } from 'mobx-react/native';
import {
  Tabs,
  Flex,
  Button,
} from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import { toJS } from 'mobx';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import PermissionForm from './form';
import store from './store';
import { BlockHeaderName } from '../../components/block';

const Header = styled.View`
  border-color: ${borderColorBase};
  border-style: solid;
  border-bottom-width: 1;
  width: 100%;
  padding-top: 10;
  padding-bottom: 10;
`;
const Container = styled.View`
  height: 100%;
  background-color: #fff;
  flex: 1;
  padding-left: 20;
  padding-right: 20;
`;
const TabView = styled.View`
  height: 50;
  width: 100%;
`;
const Footer = styled.View`
  padding-top: 24;
  height: 90;
  width: 130;
`;

@observer
class Permission extends React.Component<any> {
  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const res: any = await store.salesPermissionGroupIndexFrontGroup();
    if (res && res.length) {
      await store.salesPermissionGroupIndexAction(id, res[0].id);
    }
  }
  onChangeTab = async tab => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    store.reset();
    await store.salesPermissionGroupIndexAction(id, tab.key);
  };
  renderContent = () => {
    const { app } = this.props;
    const tabs = toJS(store.tabs);

    return (
      <Flex
        direction="column"
        style={{ height: '100%' }}
        align="center"
        justify="center"
      >
        <Header>
          <BlockHeaderName>绑定权限</BlockHeaderName>
        </Header>
        <TabView>
          <Tabs
            tabs={tabs}
            page={store.tab}
            onTabClick={this.onChangeTab}
            animated={false}
            swipeable={false}
          />
        </TabView>
        <Flex.Item style={{ width: '100%' }}>{this.renderForm()}</Flex.Item>
        <Footer>
          <Button reverse onClick={() => app.goBack('/role')}>
            完成
          </Button>
        </Footer>
      </Flex>
    );
  };
  renderForm = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return <PermissionForm store={store} roleId={id} />;
  };
  render() {
    return (
      <Flex style={{ height: '100%' }}>
        <Container>{this.renderContent()}</Container>
      </Flex>
    );
  }
}

export default Permission;
