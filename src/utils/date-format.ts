import moment from 'moment';

export const DATE_FORMAT_STRING = 'YYYY-MM-DD HH:mm:ss';
export const START_DATE_FORMAT_STRING = 'YYYY-MM-DD 00:00:00';
export const END_DATE_FORMAT_STRING = 'YYYY-MM-DD 23:59:59';

/**
 * formatDate
 * @param {*} date date string or moment object
 * @param {string} type type string('' | 'start' | 'end')
 * @returns {string} date string like DATE_FORMAT_STRING
 */
export default function formatDate(date, type = ''): string {
  switch (type) {
    case 'start':
      return moment(date).format(START_DATE_FORMAT_STRING);
    case 'end':
      return moment(date).format(END_DATE_FORMAT_STRING);
    default:
      return moment(date).format(DATE_FORMAT_STRING);
  }
}
