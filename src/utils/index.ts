import { Platform } from 'react-native';
import uuid from 'uuid';
import defaultPic from '../static/images/default.png';

/**
 * transformGoodsToCart
 * 商品列表的商品转换成购物车商品数据格式
 * @param {*} record 商品列表的商品数据
 * @returns {*} record 购物车商品数据
 */
export function transformGoodsToCart(record): any {
  return {
    ...record,
    quantity: 1,
    price: record.amount,
    discount: 100,
    pickup: true,
    gift: false,
    uuid: uuid(),
    imgPath: record.imgPath || defaultPic,
  };
}
/**
 * transformGoodsSpecification
 * 商品列表的商品规格显示字段转换
 * @param {*} record 商品列表的商品数据
 * @returns {string} specification 格式化规格
 */
export function transformGoodsSpecification({
  specification,
  color,
  texture,
}): any {
  return [specification, color, texture].filter(item => !!item).join('; ');
}

/**
 * isString
 *
 * @param {*} o 对象
 * @returns {boolean} Boolean
 */
export function isString(o): boolean {
  return Object.prototype.toString.call(o) === '[object String]';
}

export const isWeb = Platform.OS === 'web';

export const win: any = global || window;
