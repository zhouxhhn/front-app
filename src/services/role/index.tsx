import webapi from '../../utils/webapi';

// 获取角色列表
export const salesFrontRolesIndexApi = webapi.salesMember.salesFrontRolesIndex.bind(
  webapi.salesMember
);
