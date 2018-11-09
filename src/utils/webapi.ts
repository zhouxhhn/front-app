import * as webapi from '@sipin/sipin-sales-cloud-api';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { Modal } from 'antd-mobile';
import { isWeb, win } from '.';
import constants from '../services/constants/service';
import { removeUser } from '../services/user/actions';

/**
 *  处理HTTP状态码
 */
// 服务端错误
export const SERVER_ERROR = 500;
// 服务端校验不正确
export const SERVER_VALIDATION_FAILS = 400;
// 登录信息过期
export const SERVER_LOGIN_EXPIRED = 401;
// 权限验证失败
export const SERVER_PERMISSION_DENIED = 403;
// 服务器爆炸
export const SERVER_BOOM = 503;

/**
 * errorHandler
 * @param {*} error err
 * @returns {void} void
 */
function errorHandler(error: any): any {
  console.error(error);
  if (!error || !error.response) {
    Modal.alert(
      '服务器开了个小差...',
      '可能原因：1.断网了。 2.正在更新新版本，如果长时间不正常请立即联系技术人员解决！'
    );
    Toast.hide();
  } else if (error.response.body || error.response.text) {
    const res = error.response.body || JSON.parse(error.response.text);

    switch (res.code) {
      case constants.SUCCESS:
        break;
      case constants.ERROR_TOKEN_TIMEOUT_CODE:
        Toast.fail('登录信息已过期, 请重新登录');
        removeUser();
        if (isWeb) {
          win.app.push('/login');
        } else {
          win.app.push('Login');
        }
        break;
      default:
        Toast.fail(
          res.msg || res.message || constants.responseStatus[res.code]
        );
        break;
    }
  }
}

Object.keys(webapi).forEach(item => {
  webapi[item].addErrorHandler(errorHandler);
  webapi[item].setTokenHandler(() => {
    if (isWeb) {
      const userInfo: any = JSON.parse(
        localStorage.getItem(location.host + '.user') || '{}'
      );

      return userInfo.token;
    }

    return 'IiF10Kb9CTjAx1bxlzEjGg==';
  });
});

export default webapi;
