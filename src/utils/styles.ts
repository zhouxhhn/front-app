import {
  Dimensions,
  PixelRatio,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface IfontSize {
  f10: TextStyle;
  f12: TextStyle;
  f14: TextStyle;
  f16: TextStyle;
  f18: TextStyle;
}

interface IStyle extends IfontSize {
  fb: TextStyle;
  textLeft: TextStyle;
  textCenter: TextStyle;
  textRight: TextStyle;
  color333: TextStyle;
  color666: TextStyle;
  color999: TextStyle;
  colorGreen: TextStyle;
  colorRed: TextStyle;
  bgWhite: TextStyle;
  bgGreen: TextStyle;
  bgRed: TextStyle;

  p5: ViewStyle;
  pl5: ViewStyle;
  pr5: ViewStyle;
  pt5: ViewStyle;
  pb5: ViewStyle;
  m5: ViewStyle;
  ml5: ViewStyle;
  mr5: ViewStyle;
  mt5: ViewStyle;
  mb5: ViewStyle;

  p10: ViewStyle;
  pl10: ViewStyle;
  pr10: ViewStyle;
  pt10: ViewStyle;
  pb10: ViewStyle;
  m10: ViewStyle;
  ml10: ViewStyle;
  mr10: ViewStyle;
  mt10: ViewStyle;
  mb10: ViewStyle;

  p15: ViewStyle;
  pl15: ViewStyle;
  pr15: ViewStyle;
  pt15: ViewStyle;
  pb15: ViewStyle;
  m15: ViewStyle;
  ml15: ViewStyle;
  mr15: ViewStyle;
  mt15: ViewStyle;
  mb15: ViewStyle;

  p20: ViewStyle;
  pl20: ViewStyle;
  pr20: ViewStyle;
  pt20: ViewStyle;
  pb20: ViewStyle;
  m20: ViewStyle;
  ml20: ViewStyle;
  mr20: ViewStyle;
  mt20: ViewStyle;
  mb20: ViewStyle;

  p25: ViewStyle;
  pl25: ViewStyle;
  pr25: ViewStyle;
  pt25: ViewStyle;
  pb25: ViewStyle;
  m25: ViewStyle;
  ml25: ViewStyle;
  mr25: ViewStyle;
  mt25: ViewStyle;
  mb25: ViewStyle;

  p30: ViewStyle;
  pl30: ViewStyle;
  pr30: ViewStyle;
  pt30: ViewStyle;
  pb30: ViewStyle;
  m30: ViewStyle;
  ml30: ViewStyle;
  mr30: ViewStyle;
  mt30: ViewStyle;
  mb30: ViewStyle;

  p35: ViewStyle;
  pl35: ViewStyle;
  pr35: ViewStyle;
  pt35: ViewStyle;
  pb35: ViewStyle;
  m35: ViewStyle;
  ml35: ViewStyle;
  mr35: ViewStyle;
  mt35: ViewStyle;
  mb35: ViewStyle;

  p40: ViewStyle;
  pl40: ViewStyle;
  pr40: ViewStyle;
  pt40: ViewStyle;
  pb40: ViewStyle;
  m40: ViewStyle;
  ml40: ViewStyle;
  mr40: ViewStyle;
  mt40: ViewStyle;
  mb40: ViewStyle;

  p45: ViewStyle;
  pl45: ViewStyle;
  pr45: ViewStyle;
  pt45: ViewStyle;
  pb45: ViewStyle;
  m45: ViewStyle;
  ml45: ViewStyle;
  mr45: ViewStyle;
  mt45: ViewStyle;
  mb45: ViewStyle;

  p50: ViewStyle;
  pl50: ViewStyle;
  pr50: ViewStyle;
  pt50: ViewStyle;
  pb50: ViewStyle;
  m50: ViewStyle;
  ml50: ViewStyle;
  mr50: ViewStyle;
  mt50: ViewStyle;
  mb50: ViewStyle;

  flexRow: ViewStyle;
  flexCol: ViewStyle;
  flexItem: ViewStyle;
  flexItemCenter: ViewStyle;
  flexItemMiddle: ViewStyle;
  flexCenterMiddle: ViewStyle;
  flexItemBottom: ViewStyle;

  imageContain: ViewStyle;
  imageCover: ViewStyle;
  imageStretch: ViewStyle;

  divider: ViewStyle;
}

// 字体大小
const FONT_SIZE: any = [10, 12, 14, 16, 18, 20];
const fontSize: IfontSize = FONT_SIZE.reduce((pre, cur) => {
  pre[`f${cur}`] = {
    fontSize: cur,
  };

  return pre;
}, {});

// 内外边距
const MARGIN_SIZE = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const marginStyle: any = MARGIN_SIZE.reduce((pre, cur) => {
  pre[`p${cur}`] = {
    padding: cur,
  };
  pre[`pl${cur}`] = {
    paddingLeft: cur,
  };
  pre[`pr${cur}`] = {
    paddingRight: cur,
  };
  pre[`pt${cur}`] = {
    paddingTop: cur,
  };
  pre[`pb${cur}`] = {
    paddingBottom: cur,
  };
  pre[`m${cur}`] = {
    margin: cur,
  };
  pre[`ml${cur}`] = {
    marginLeft: cur,
  };
  pre[`mr${cur}`] = {
    marginRight: cur,
  };
  pre[`mt${cur}`] = {
    marginTop: cur,
  };
  pre[`mb${cur}`] = {
    marginBottom: cur,
  };

  return pre;
}, {});

const flexStyle = {
  // flex 容器， 横向
  flexRow: {
    flexDirection: 'row',
  },
  // flex 容器， 纵向
  flexCol: {
    flexDirection: 'column',
  },
  // 等分布局
  flexItem: {
    flex: 1,
  },
  // 水平居中
  flexItemCenter: {
    alignItems: 'center',
  },
  // 垂直居中
  flexItemMiddle: {
    justifyContent: 'center',
  },
  // 居下
  flexItemBottom: {
    justifyContent: 'flex-end',
  },
  // 两端
  flexItemBetween: {
    justifyContent: 'space-between',
  },
  // 水平垂直居中
  flexCenterMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const imageStyle = {
  // contain 模式容器完全容纳图片，图片自适应宽高
  imageContain: {
    resizeMode: 'contain',
  },
  // cover模式同100px高度模式
  imageCover: {
    resizeMode: 'cover',
  },
  // stretch模式图片被拉伸适应屏幕
  imageStretch: {
    resizeMode: 'stretch',
  },
};

const fontStyle = {
  fb: {
    fontWeight: '700',
  },
  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  color333: {
    color: '#333',
  },
  color666: {
    color: '#666',
  },
  color999: {
    color: '#999',
  },
  colorGreen: {
    color: '#49BC1C',
  },
  colorRed: {
    color: '#e87c70',
  },
  bgWhite: {
    backgroundColor: '#fff',
  },
  bgGreen: {
    backgroundColor: '#49BC1C',
  },
  bgRed: {
    backgroundColor: '#e87c70',
  },
};

export const winWidth = Dimensions.get('window').width;
export const winHeight = Dimensions.get('window').height;
export const getImageSize = (
  realWidth: number,
  width: number,
  height: number
): { width: number; height: number } => {
  return {
    width: realWidth,
    height: height * (realWidth / width),
  };
};

export const style = StyleSheet.create<IStyle>({
  ...fontStyle,
  ...fontSize,
  ...marginStyle,
  ...flexStyle,
  ...imageStyle,
  divider: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#ccc',
  },
});
