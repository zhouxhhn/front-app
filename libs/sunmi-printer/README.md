## API

### Constants

|      Name       |     Description      |
| :-------------: | :------------------: |
|    Constants    |     打印状态常量     |
|   hasPrinter    | boolean,是否有打印机 |
| printerVersion  |    打印机固件版本    |
| printerSerialNo |     打印机序列号     |
|  printerModal   |      打印机型号      |

### Printer Status

|           Name           |     Description      |
| :----------------------: | :------------------: |
|   OUT_OF_PAPER_ACTION    |       缺纸异常       |
|       ERROR_ACTION       |       打印错误       |
|      NORMAL_ACTION       |       可以打印       |
|    COVER_OPEN_ACTION     |        开盖子        |
|    COVER_ERROR_ACTION    |      关盖子异常      |
|   KNIFE_ERROR_1_ACTION   |  切刀异常 1－卡切刀  |
|   KNIFE_ERROR_2_ACTION   | 切刀异常 2－切刀修复 |
|   OVER_HEATING_ACITON    |    打印头过热异常    |
| FIRMWARE_UPDATING_ACITON |  打印机固件开始升级  |

#### Example

```javascript
import React, { Component } from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';
import SunmiInnerPrinter from 'react-native-sunmi-inner-printer';

class PrinterComponent extends Component {
  componentWillMount() {
    this._printerStatusListener = DeviceEventEmitter.addListener(
      'PrinterStatus',
      action => {
        switch (action) {
          case SunmiInnerPrinter.Constants.NORMAL_ACTION: // 可以打印
            // your code
            break;
          case SunmiInnerPrinter.Constants.OUT_OF_PAPER_ACTION: // 缺纸异常
            // your code
            break;
          case SunmiInnerPrinter.Constants.COVER_OPEN_ACTION: // 开盖子
            // your code
            break;
          default:
          // your code
        }
      }
    );
  }

  componentWillUnmount() {
    this._printerStatusListener.remove();
  }

  render() {
    return (
      <View>
        <Text>Hello World!</Text>
      </View>
    );
  }
}
```
