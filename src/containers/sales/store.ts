import math from '@sipin/basic-libs/lib/js/math';
import { action, computed, observable } from 'mobx';

class CartStore {
  @observable
  sellerId: string = '';
  @observable
  goods: any[] = [];

  @computed
  get needDelivery() {
    let ret = false;
    if (this.goods && this.goods.length) {
      this.goods.forEach(item => {
        if (item.pickup === false) {
          ret = true;
        }
      });
    }

    return ret;
  }
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
  get discounted() {
    const discounted = math.Sub(this.amount, this.price, 2);
    if (isNaN(discounted)) {
      return '0.00';
    }

    return discounted;
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

  @action
  setStore(key, value) {
    this[key] = value;
  }
}
const cartStore = new CartStore();
export default cartStore;
