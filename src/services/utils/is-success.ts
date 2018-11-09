import constants from '../constants/service';

/**
 * isSuccess
 * @export isSuccess
 * @param {*} res api res
 * @returns {boolean} boolean
 */
export default function isSuccess(res: any): any {
  return res && res.code === constants.SUCCESS;
}
