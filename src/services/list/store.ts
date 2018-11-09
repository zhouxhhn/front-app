import { action, computed, observable } from 'mobx';
import isSuccess from '../utils/is-success';
import proxy from '../utils/proxy';

export default class ListStore {
  @observable
  keyword: string = '';
  @observable
  loadingCount: number = 0;
  @observable
  dataSource: any = [];
  list: any[] = [];
  @observable
  page: number;
  pages: number;
  total: number;
  size: number;
  apis: {
    getList: any;
  };
  constructor({ apis }) {
    this.apis = apis;
  }
  @computed
  get hasMore() {
    return +this.pages > +this.page;
  }
  @action
  setKeyword(value) {
    this.keyword = value;
  }
  @action
  setPage(value) {
    this.page = value;
  }
  @action
  setLoading(bool) {
    if (bool) {
      this.loadingCount = this.loadingCount + 1;
    } else {
      this.loadingCount = this.loadingCount - 1;
    }
  }
  @action
  setDataSource(dataSource = []) {
    this.dataSource = dataSource;
  }
  async fetchData({ page = 1, size = 10, keyword = '', params = {} }) {
    this.setLoading(true);
    const res = await proxy(
      this.apis.getList({ page, size, search: keyword, ...params })
    );
    this.setLoading(false);
    if (isSuccess(res)) {
      const data = res.data;
      this.size = data.size;
      this.pages = data.pages;
      this.total = data.total;
      this.setKeyword(keyword);
      this.setPage(data.current);
    }

    return res;
  }
  async loadMore({ params }) {
    if (!this.hasMore) {
      return false;
    }
    const res = await this.fetchData({
      page: this.page + 1,
      size: this.size,
      keyword: this.keyword,
      params,
    });
    if (isSuccess(res)) {
      const data = res.data;
      const records = data.records;
      this.list = Array.from(new Set(this.list.concat(records)));
      this.setDataSource(this.list);
    }

    return true;
  }
  async getList({ page = 1, /* size = 10, */ keyword = '', params }) {
    const res = await this.fetchData({
      page,
      size: this.size,
      keyword,
      params,
    });
    if (isSuccess(res)) {
      const data = res.data;
      this.list = data.records;
      this.setDataSource(this.list);
    }
  }
}
