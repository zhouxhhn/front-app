/**
 * 优惠券排序
 * @param {*} couponList 优惠券列表
 * @returns {*} couponList
 */
export function sortCoupon(couponList): any[] {
  const usable = [];
  const disable = [];
  couponList.forEach(
    item => (!item.disabled ? usable.push(item) : disable.push(item))
  );
  const sortList = [].concat(usable).concat(disable);

  return sortList;
}
