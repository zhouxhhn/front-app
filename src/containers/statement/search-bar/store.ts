import { action, observable, computed } from 'mobx';
import moment from 'moment';
import formatDate from '../../../utils/date-format';

class SearchBarStore {
  @observable
  day: null | string = null;
  @observable
  minDate: null | string | Date = null;
  @observable
  maxDate: null | string | Date = null;

  @action
  setDay(value) {
    this.day = value;

    if (value && value.length) {
      switch (value[0]) {
        case 'today':
          this.minDate = new Date(formatDate(moment()));
          this.maxDate = new Date(formatDate(moment()));
          break;
        case 'yesterday':
          {
            const startDate = moment()
              .day(moment().day() - 1)
              .startOf('day')
              .valueOf();
            const endDate = moment()
              .day(moment().day() - 1)
              .endOf('day')
              .valueOf();
            this.minDate = new Date(startDate);
            this.maxDate = new Date(endDate);
          }
          break;
        case 'lastWeek':
          {
            const startDate = moment()
              .week(moment().week() - 1)
              .startOf('week')
              .valueOf();
            const endDate = moment()
              .week(moment().week() - 1)
              .endOf('week')
              .valueOf();
            this.minDate = new Date(formatDate(startDate));
            this.maxDate = new Date(formatDate(endDate));
          }
          break;
        case 'lastMonth':
          {
            const startDate = moment()
              .month(moment().month() - 1)
              .startOf('month')
              .valueOf();
            const endDate = moment()
              .month(moment().month() - 1)
              .endOf('month')
              .valueOf();
            this.minDate = new Date(formatDate(startDate));
            this.maxDate = new Date(formatDate(endDate));
          }
          break;
        default:
          break;
      }
    }
  }
  @action
  setMinDate(value) {
    this.day = null;
    this.minDate = value;
  }
  @action
  setMaxDate(value) {
    this.day = null;
    this.maxDate = value;
  }
  @action
  reset() {
    this.day = null;
    this.minDate = null;
    this.maxDate = null;
  }

  @computed
  get params() {
    let o: any = {};
    if (this.minDate) {
      o.beforeAt = formatDate(this.minDate, 'start');
    }
    if (this.maxDate) {
      o.endAt = formatDate(this.maxDate, 'end');
    }

    return o;
  }
}

const searchBarStore = new SearchBarStore();

export default searchBarStore;
