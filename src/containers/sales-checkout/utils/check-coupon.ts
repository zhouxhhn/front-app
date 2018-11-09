import math from '@sipin/basic-libs/lib/js/math';
/**
 * 检查优惠券是否可用
 * checkCoupon
 * @param {*} {coupon, goods} 优惠券, 商品价格合计, 商品列表
 * @returns {boolean} 是否可用
 */
function checkCoupon({ coupon, goods }): boolean {
  // disabled: transformCoupon 时预判了有效期和无商品限制的条件
  if (coupon.disabled) {
    return false;
  }

  // 判断商品限制的其他条件
  const { goodsSkuSn, requirementType, threshold } = coupon;

  // 如果优惠券限定商品
  if (goodsSkuSn && goodsSkuSn.length) {
    // 是否包含限定商品
    let hasCouponSku = false;
    // 包含限定商品的总价
    let couponSkuTotalPrice = 0;

    goods.forEach(item => {
      if (~goodsSkuSn.indexOf(String(item.sku))) {
        hasCouponSku = true;
        couponSkuTotalPrice += +math.Mul(item.price, item.quantity, 0);
      }
    });

    // 不包含限定商品, 不可用
    if (!hasCouponSku) {
      return false;
    }

    // 包含限定商品, 限定商品总价小于优惠券限制金额, 不可用
    if (requirementType === 1) {
      if (couponSkuTotalPrice < threshold) {
        return false;
      }
    }
  }

  return true;
}

export default checkCoupon;
