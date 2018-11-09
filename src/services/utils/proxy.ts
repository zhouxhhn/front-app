import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import { isWeb, win } from '../../utils';
import constants from '../constants/service';
import { removeUser } from '../user/actions';

export interface ResType {
  code?: string | number;
  data?: any;
  msg?: string;
  status?: string;
  message?: string;
}

/**
 * proxy
 *
 * @export
 * @param {*} promise api promise
 * @returns {Promise<ResType>} res
 */
export default function proxy(promise: Promise<any>): Promise<ResType> {
  return new Promise((resolve, reject) => {
    promise
      .then(function(res: ResType) {
        switch (Number(res.status)) {
          case constants.ERROR_SERVER_ERROR_CODE:
            Toast.fail(
              `${constants.ERROR_SERVER_ERROR_CODE} ${res.msg ||
                res.message ||
                constants.responseStatus[res.code]}`
            );
            reject(res);

            return;
          default:
            break;
        }
        switch (res.code) {
          case constants.SUCCESS:
            resolve(res);
            break;
          case constants.ERROR_TOKEN_TIMEOUT_CODE:
            Toast.fail('登录信息已过期, 请重新登录');
            reject(res);
            removeUser();
            if (isWeb) {
              win.app.push('/login');
              window.location.reload();
            } else {
              win.app.push('Login');
            }
            break;
          default:
            Toast.fail(
              res.msg || res.message || constants.responseStatus[res.code]
            );
            reject(res);
            break;
        }
      })
      .catch(function(err: any) {
        reject(err);
      });
  });
}
