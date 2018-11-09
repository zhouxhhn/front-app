require('babel-polyfill');

import React from 'react';
import { render } from 'react-dom';
import initReactFastclick from 'react-fastclick';
import { AppContainer } from 'react-hot-loader';
import '@sipin/sipin-sales-cloud-components/src/components/iconfont/style';
import routes from './src/routes';
import createRouterConfig from './src/router.web';
import { historyPush, historyGoBack } from './src/utils/history.web';
// eslint-disable-next-line
import 'antd-mobile/dist/antd-mobile.css';

// https => http
if (location.protocol === 'https:') {
  location.href = location.href.replace('https:', 'http:');
}

initReactFastclick();

window.app = {
  push: historyPush,
  goBack: historyGoBack,
};

const renderApp = async () => {
  const Component = await createRouterConfig(routes);
  render(
    <AppContainer>{Component}</AppContainer>,
    document.getElementById('app')
  );

  // 启动商米T2的副屏
  setTimeout(() => {
    if (
      window.sipinSalesSunmiApp &&
      window.sipinSalesSunmiApp.sendToSunmiT2Screen
    ) {
      window.sipinSalesSunmiApp.sendToSunmiT2Screen({
        content: '欢迎光临',
      });
    }
  }, 1000);
};

renderApp();

if (module.hot) {
  module.hot.accept('./src/router.web', () => {
    renderApp();
  });
}
