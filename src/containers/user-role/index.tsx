import * as React from 'react';
import { observer } from 'mobx-react/native';
import {
  Flex,
  Button,
  Toast,
} from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import { borderColorBase } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import store from './store';
import { BlockHeaderName } from '../../components/block';
import RoleForm from './form';
import SelectedRoles from './selected-roles';

const Container = styled.View`
  height: 100%;
  background-color: #fff;
  flex: 1;
  padding-left: 20;
  padding-right: 20;
`;
const Header = styled.View`
  width: 100%;
  padding-top: 10;
  padding-bottom: 10;
`;
const Body = styled(Flex)`
  width: 100%;
  flex: 1;
`;
const Footer = styled(Flex)`
  padding-top: 24;
  height: 90;
  width: 280;
`;

const Title = styled.Text`
  line-height: 30;
  border-color: ${borderColorBase};
  border-style: solid;
  border-bottom-width: 1;
`;

@observer
class UserRole extends React.Component<any> {
  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    await store.salesFrontRolesIndex();
    await store.salesFrontUserSearchUser(id);
  }
  componentWillUnmount() {
    store.reset();
  }
  renderContent = () => {
    const { app } = this.props;
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return (
      <Flex
        direction="column"
        style={{ height: '100%' }}
        align="center"
        justify="center"
      >
        <Header>
          <BlockHeaderName>绑定角色</BlockHeaderName>
        </Header>
        <Body>
          <Flex.Item style={{ marginRight: 40, height: '100%' }}>
            <Title>已选角色</Title>
            {this.renderLeft()}
          </Flex.Item>
          <Flex.Item style={{ marginLeft: 40, height: '100%' }}>
            <Title>角色列表</Title>
            {this.renderRight()}
          </Flex.Item>
        </Body>
        <Footer>
          <Flex.Item style={[{ marginRight: 10, flex: 1 }]}>
            <Button onClick={() => app.goBack('/user')}>取消</Button>
          </Flex.Item>
          <Flex.Item style={[{ marginLeft: 10, flex: 1 }]}>
            <Button
              reverse
              onClick={async () => {
                const res = await store.salesFrontUserSetRole(id);
                if (res) {
                  Toast.success('保存成功!');
                  setTimeout(() => {
                    app.goBack('/user');
                  }, 100);
                }
              }}
            >
              确定
            </Button>
          </Flex.Item>
        </Footer>
      </Flex>
    );
  };
  renderRight = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return <RoleForm store={store} userId={id} />;
  };
  renderLeft = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    return <SelectedRoles store={store} userId={id} />;
  };
  render() {
    return (
      <Flex style={{ height: '100%' }}>
        <Container>{this.renderContent()}</Container>
      </Flex>
    );
  }
}

export default UserRole;
