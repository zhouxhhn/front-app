import math from '@sipin/basic-libs/lib/js/math';
/**
 * 获取优惠券优惠价格
 * @param {*} price 购物车总价
 * @param {*} coupon 优惠券信息
 * @returns {string} coupon price
 */
export default function getCouponPrice(price, coupon): string {
  let couponPrice = '0.00';
  if (coupon) {
    switch (coupon.discountType) {
      case '0':
        couponPrice = math.Mul(1, coupon.value, 2);
        break;
      case '1':
        couponPrice = math.Sub(price, math.Mul(price, coupon.value, 2), 2);
        break;
    }
  }

  return couponPrice;
}
