import * as React from 'react';
import { checkPermission } from './utils';

export interface PermissionProps {
  children?: any;
  userPermission: string[]; // 用户权限
  permission?: string | string[]; // 组件权限
  renderForbiddenView?: () => React.ReactElement<any>; // 没有权限时, 定义返回界面. 未定义则返回 null
}
class Permission extends React.Component<PermissionProps> {
  checkPermission() {
    const { userPermission, permission } = this.props;

    return checkPermission({ userPermission, permission });
  }

  render() {
    const { children, renderForbiddenView } = this.props;
    const hasPermission = this.checkPermission();
    if (hasPermission === true) {
      return children;
    } else {
      return renderForbiddenView ? renderForbiddenView() : null;
    }
  }
}

export default Permission;
