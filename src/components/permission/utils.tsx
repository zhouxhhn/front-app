import { isArray } from 'util';

export interface CheckPermissionParams {
  userPermission: string[]; // 用户权限
  permission?: string | string[]; // 组件权限
}
/**
 * checkPermission
 *
 * @export
 * @param {CheckPermissionParams} {
 *   userPermission,
 *   permission,
 * } CheckPermissionParams
 * @returns {boolean} 是否有权限
 */
export function checkPermission({
  userPermission,
  permission,
}: CheckPermissionParams): boolean {
  // permission 为空或为定义, 则表示不需要权限检查, 默认通过, 返回 true
  if (!permission) {
    return true;
  }

  if (isArray(permission)) {
    // permission 是数组, 则需满足多个权限
    // 检测数组的每个权限，如果全部权限满足，返回true，有一个权限不满足则返回false
    let ret: boolean = true;
    for (let item of permission) {
      if (userPermission.indexOf(item) === -1) {
        ret = false;
        break;
      }
    }

    return ret;
  } else {
    // permission 不是数组, 即是字符串(权限名) 则检查是否在用户权限数组中
    return userPermission.indexOf(permission) > -1;
  }
}
