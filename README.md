# sipin-sales-cloud-frontend-android

## 安卓开发

- `yarn` 安装依赖
- `API_HOST=http://10.0.30.118:8005 yarn start` 启动编译
- `react-native run-android` 开启模拟器或真机调试

## Web 开发

- `yarn` 安装依赖
- `yarn web` 启动编译

## 连接真机调试

- 连接数据线或者 wifi 连接： `adb connect 10.0.20.161`
- `adb devices`
- `adb reverse tcp:8081 tcp:8081`
- `react-native run-android`

## 打开真机的调试选项

- `adb shell input keyevent 82`
