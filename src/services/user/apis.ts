import webapi from '../../utils/webapi';

// 获取用户列表
export const salesFrontUserIndexUserApi = webapi.salesMember.salesFrontUserIndexUser.bind(
  webapi.salesMember
);
