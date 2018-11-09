/**
 * Created by alan on 2017/8/9.
 */
var {NativeModules, ToastAndroid} = require('react-native');
var DoubleScreen = NativeModules.DoubleScreen;

export default class SunmiScreen {
  static async init(models) {
    try {
      this.models = models || DataModel;
      const result = await DoubleScreen.init();
      return result;
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async isConnected() {
    try {
      const result = await DoubleScreen.isConnected();
      return result;
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async getDSDPackageName() {
    try {
      const result = await DoubleScreen.getDSDPackageName();
      return result;
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async sendTxtData(data) {
    try {
      if (!data || typeof data !== "object") {
        return this.error("-1", "invalid data format");
      }
      const result = await DoubleScreen.sendTxtData(JSON.stringify(data));
      return result;
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async sendTxtMediaData(data) {
    try {
      if (!this.dataValidate(data)) {
        return this.error("-1", "invalid data format");
      }
      let _data = JSON.parse(JSON.stringify(data));
      let listData = {
        title: _data.title,
        head: _data.head,
        list: _data.list,
        KVPList: _data.KVPList,
        alternateTime: _data.alternateTime,
      };
      let finalData = data.rotation_time ? {rotation_time: data.rotation_time} : {
          data: JSON.stringify(listData),
          dataModel: data.model,
        };

      if (!data.taskId) {
        data.taskId = Date.parse(new Date()) + "";
      }
      if (typeof _data.media === "string") {
        const result = await DoubleScreen.sendTxtMediaData(JSON.stringify(finalData), _data.media, data.taskId);
        return result;
      } else if (_data.media instanceof Array && _data.media.length === 1) {
        const result = await DoubleScreen.sendTxtMediaData(JSON.stringify(finalData), _data.media[0], data.taskId);
        return result;
      } else if (_data.media instanceof Array && _data.media.length > 1) {
        const result = await DoubleScreen.sendImgs(JSON.stringify(finalData), _data.media, data.taskId);
        return result;
      }
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async playVideo(data) {
    try {
      if (!data.media) {
        return this.error("-1", "invalid data format");
      }
      if (!data.taskId) {
        data.taskId = Date.parse(new Date()) + "";
      }
      const result = await DoubleScreen.playVideo(data.media, data.taskId);
      return result;
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async sendImgsCarousel() {
    try {
      const result = await DoubleScreen.sendImgsCarousel();
      return result;
    } catch ({code, message}) {
      return this.error(code, message);
    }
  };

  static async playCustom(data, media, taskId){
    try {
      // ToastAndroid.show("playCustom" + (this.models.HOT_PATCH === data.dataModel), ToastAndroid.SHORT);
      let result;
      switch (data.dataModel){
        case this.models.SHOW_IMG_LIST:
        case this.models.SHOW_VIDEO_LIST:
        case this.models.SHOW_PAID_SUCCESS:
        case this.models.HOT_PATCH:
          result = await DoubleScreen.sendTxtMediaData(JSON.stringify(data), media, taskId);
          return result;
          break;
        case this.models.SHOW_IMGS_LIST:
        case this.models.SHOW_IMGS:
          result = await DoubleScreen.sendImgs(JSON.stringify(data), media, taskId);
          return result;
          break;
        case this.models.SHOW_VIDEO:
          result = await DoubleScreen.playVideo(media, taskId);
          return result;
          break;
        default:
      }
    } catch ({code, message}) {
      return this.error(code, message);
    }
  }

  static error(code, message) {
    let error = {
      code: code,
      message: message
    };
    return error;
  }

  static dataValidate(data) {
    return (data.title && data.list && data.KVPList && data.alternateTime && data.media && data.model) || data.rotation_time;
  }
}

const DataModel = {
  SHOW_IMG_LIST : "SHOW_IMG_LIST",
  SHOW_VIDEO_LIST : "SHOW_VIDEO_LIST",
  SHOW_IMGS_LIST : "SHOW_IMGS_LIST",
  SHOW_PAID_SUCCESS: "SHOW_PAID_SUCCESS",
  SHOW_IMGS : "SHOW_IMGS",
  SHOW_VIDEO : "SHOW_VIDEO",
  HOT_PATCH: "HOT_PATCH"
}
