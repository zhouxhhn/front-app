#### Example

```javascript
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ToastAndroid
} from 'react-native';
import DoubleScreen from 'react-native-double-screen';

import { DSManager, DSTask } from './DSManager';

export default class test3 extends Component {
  dsManager;

  constructor(props) {
    super(props);
    this.dsManager = new DSManager();
  }

  init() {
    DoubleScreen.init().then(data => {
      ToastAndroid.show('init: ' + JSON.stringify(data), ToastAndroid.SHORT);
    });
  }

  isConnected() {
    DoubleScreen.isConnected().then(data => {
      ToastAndroid.show(
        'isConnected: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  getDSDPackageName() {
    DoubleScreen.getDSDPackageName().then(data => {
      ToastAndroid.show(
        'getDSDPackageName: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  sendTxtData() {
    let content = {
      title: 'title',
      content: 'content'
    };
    DoubleScreen.sendTxtData(content).then(data => {
      ToastAndroid.show(
        'sendTxtData: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  sendTxtImgData() {
    //第一步：初始化一个任务，主要添加图片或者视频信息，或者通过taskId从任务池中获取一个已保存的任务 this.dsManager.getTask(task.taskId)
    let task = new DSTask({
      type: 1, //1：列表+单图；2：列表+视频；3：列表+轮播；4：轮播；5：视频
      media: 'big.png', //图片或视频名(带后缀)，或名称数组
      taskId: 'big.png', //唯一识别ID
      callback: data => {
        ToastAndroid.show(
          'sendTxtImgData: ' + JSON.stringify(data),
          ToastAndroid.SHORT
        );
      }
    });
    //第二步：如果是带列表的任务，设置任务中列表相关的数据
    //方法1：直接赋值
    task.setList([
      {
        name: '红米Note4 4GB+64GB',
        unitPrice: '1399.00',
        quantity: '2',
        sumPrice: '1399.00'
      },
      {
        name: '红米4 4GB+64GB',
        unitPrice: '1399.00',
        quantity: '2',
        sumPrice: '1399.00'
      }
    ]);
    task.setKVP({
      quantity: '4', //商品数量，默认0
      freight: '0.00', //运费总价，默认0
      coupon: '0.00', //用券金额，默认0
      amount: '10000.00' //支付金额，默认0
    });
    //方法2：对单个物品或总计信息进行修改
    task.txt.setTitle('小米之家'); //默认"商品信息"
    task.txt.addItem({
      //添加物品
      name: '小米MAX2 4GB+64GB',
      unitPrice: '1399.00',
      quantity: '2',
      sumPrice: '1399.00'
    });
    task.txt.setItemName(1, '小米7 4GB+64GB'); //修改index=1的物品名称
    task.txt.setItemUnitPrice(1, '2000.00'); //修改index=1的物品单价
    task.txt.setItemQuantity(1, 5); //修改index=1的物品数量
    task.txt.setItemSumPrice(1, '4000.00'); //修改index=1的物品小计
    task.txt.setQuantity('6'); //修改商品数量
    task.txt.setFreight('10.00'); //修改运费总价
    task.txt.setCoupon('6.00'); //修改用券金额
    task.txt.setAmount('2000.00'); //修改支付金额
    //第三步：保存任务或执行任务
    this.dsManager.addTask(task); //只保存到任务池，但不执行
    this.dsManager.playTask(task.taskId); //执行任务，如果任务池中没有，自动保存
  }

  sendTxtVideoData() {
    let content = Data;
    content.model = 'SHOW_VIDEO_LIST';
    content.media = 'Tencent/QQfile_recv/video.mp4';
    // content.media = "video.mp4";
    content.taskId = 'Tencent/QQfile_recv/video.mp4';
    DoubleScreen.sendTxtMediaData(content).then(data => {
      ToastAndroid.show(
        'sendTxtVideoData: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  sendTxtImgsData() {
    let content = Data;
    content.model = 'SHOW_IMGS_LIST';
    content.alternateTime = '2000';
    content.media = ['big.png', 'sunmi2.png'];
    content.taskId = 'mi6';
    DoubleScreen.sendTxtMediaData(content).then(data => {
      ToastAndroid.show(
        'sendTxtImgsData: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  sendImgs() {
    let content = {};
    content.rotation_time = '2000';
    content.media = ['big.png', 'sunmi2.png'];
    content.taskId = 'sendImgs';
    DoubleScreen.sendTxtMediaData(content).then(data => {
      ToastAndroid.show(
        'sendTxtImgsData: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  playVideo() {
    let content = {};
    content.media = 'Tencent/QQfile_recv/video.mp4';
    content.taskId = 'playVideo3';
    // let videoName = "video.mp4";
    DoubleScreen.playVideo(content).then(data => {
      ToastAndroid.show(
        'playVideo: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  sendImgsCarousel() {
    DoubleScreen.sendImgsCarousel().then(data => {
      ToastAndroid.show(
        'sendImgsCarousel: ' + JSON.stringify(data),
        ToastAndroid.SHORT
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.init.bind(this)}>
          <Text style={styles.welcome}>init</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.isConnected.bind(this)}>
          <Text style={styles.welcome}>isConnected</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.getDSDPackageName.bind(this)}>
          <Text style={styles.welcome}>getDSDPackageName</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.sendTxtData.bind(this)}>
          <Text style={styles.welcome}>sendData</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.sendTxtImgData.bind(this)}>
          <Text style={styles.welcome}>sendTxtImgData</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.sendTxtVideoData.bind(this)}>
          <Text style={styles.welcome}>sendTxtVideoData</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.sendTxtImgsData.bind(this)}>
          <Text style={styles.welcome}>sendTxtImgsData</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.sendImgs.bind(this)}>
          <Text style={styles.welcome}>sendImgs</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.playVideo.bind(this)}>
          <Text style={styles.welcome}>playVideo</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.sendImgsCarousel.bind(this)}>
          <Text style={styles.welcome}>sendImgsCarousel</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('test3', () => test3);
```
