import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import clickEvent from '@sipin/sipin-sales-cloud-components/src/utils/click-event';
import Store from '../../services/list/store';
import { salesFrontRolesIndexApi } from '../../services/role';
import { BlockHeaderName } from '../../components/block';
import ListBlock from '../../components/list-block';
import RoleListHeader from './components/list-header';
import RoleListItem from './components/list-item';
import RoleFormModal from './components/form';
import CreateButton from '../../components/create-button';

@observer
class List extends Component<any> {
  constructor(props: any) {
    super(props);
    this.store = new Store({
      apis: { getList: salesFrontRolesIndexApi },
    });
    this.store.size = 20;
  }

  modal: any;
  permissionModal: any;
  store: any;
  render() {
    const { app } = this.props;
    const data = toJS(this.store.dataSource);

    return (
      <>
        <ListBlock
          HeaderLeft={<BlockHeaderName>角色管理</BlockHeaderName>}
          store={this.store}
          data={data}
          ListHeaderComponent={RoleListHeader}
          ListItemComponent={props => (
            <RoleListItem
              {...props}
              store={this.store}
              modal={this.modal}
              app={app}
            />
          )}
        />
        <CreateButton {...clickEvent(() => this.modal.open())}>
          添加角色
        </CreateButton>
        <RoleFormModal
          ref={c => c && (this.modal = c.modal)}
          cb={() => this.store.getList({ size: 20, page: 1 })}
        />
      </>
    );
  }
}

export default List;
