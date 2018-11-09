import { Dimensions } from 'react-native';

const win = Dimensions.get('window');

export const DEFAULT_GOODS_IMG_URL = require('../static/images/default.png');

export const HEADER_HEIGHT = 105;

export const CONTENT_HEIGHT = win.height - HEADER_HEIGHT - 10;
