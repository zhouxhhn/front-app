import math from '@sipin/basic-libs/lib/js/math';
import { action, computed, observable } from 'mobx';

class PurchaseStore {
  @observable
  goods: any[] = [];

  @action
  setStore(key, value) {
    this[key] = value;
  }

  @action
  addGoods(value) {
    this.goods.push(value);
  }

  @action
  setGoods(value) {
    this.goods = value;
  }

  @action
  setGoodsItem(value, i) {
    this.goods[i] = value;
  }
  @action
  emptyCart() {
    this.goods = [];
  }

  // 购物车
  @computed
  get amount() {
    if (this.goods.length) {
      let amount = '0.00';
      this.goods.forEach(item => {
        amount = math.Add(amount, math.Mul(item.amount, item.quantity, 2), 2);
      });

      return amount;
    }

    return '0.00';
  }
  @computed
  get price() {
    if (this.goods.length) {
      let price = '0.00';
      this.goods.forEach(item => {
        price = math.Add(price, math.Mul(item.price, item.quantity, 2), 2);
      });

      return price;
    }

    return '0.00';
  }
  @computed
  get quantity() {
    if (this.goods.length) {
      let quantity = 0;
      this.goods.forEach(item => {
        quantity = math.Add(quantity, item.quantity, 0);
      });

      return quantity;
    }

    return 0;
  }
}
const purchaseStore = new PurchaseStore();
export default purchaseStore;
