import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Layout from './components/layout/index.android';

/**
 * 处理 Native 端路由
 *
 * @param {*} [routes=[]] routes 路由配置数组
 * @returns {*} 路由
 */
function createRouterConfig(routes): any {
  const configs = routes
    .filter(item => item.path !== '/login')
    .reduce((acc, cur) => {
      const component = (props): any => {
        const { navigation } = props;
        const push = path => navigation.push(path);
        const goBack = () => navigation.goBack();
        const appProps = {
          push,
          goBack,
        };
        if (cur.auth) {
          return (
            <Layout app={appProps}>
              <cur.component {...props} app={appProps} />
            </Layout>
          );
        }

        return <cur.component app={appProps} />;
      };

      acc[cur.path] = {
        screen: component,
      };

      return acc;
    }, {});

  return createStackNavigator(configs, {
    initialRouteName: '/',
    headerMode: 'none',
  });
}

export default createRouterConfig;
