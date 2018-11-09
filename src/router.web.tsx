import React from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import { parseRoutes } from './utils/router';
import Layout from './components/layout/index.web';
import AsyncLoader from './components/async-loader';
import { Permission } from './components/permission';
import { getUserByWeb } from './services/user/actions';
import { historyPush, historyGoBack } from './utils/history.web';

/**
 * 处理 WEB 端路由
 *
 * @param {*} [routes=[]] routes 路由配置数组
 * @returns {Promise<React.ReactElement<*>>} 动态路由
 */
async function createRouterConfig(
  routes: any[] = []
): Promise<React.ReactElement<any>> {
  const rs = parseRoutes(routes);

  const appProps = {
    routes: rs,
    push: historyPush,
    goBack: historyGoBack,
  };

  const renderRoutes = rs.map((route, i) => {
    if (route.redirectTo) {
      return (
        <Route
          exact
          path={route.path}
          render={() => <Redirect to={route.redirectTo} />}
        />
      );
    }
    if (route.auth) {
      const renderFn = (props: any): any => {
        const { location } = props;
        const userInfo: any = getUserByWeb();

        return userInfo.token ? (
          <Layout app={appProps} activeMenuKey={route.menuKey}>
            <Permission
              userPermission={userInfo.permission}
              permission={route.permission}
              renderForbiddenView={() => (
                <div>403 Forbidden or No Permission to Access</div>
              )}
            >
              <AsyncLoader
                type={route.type}
                path={route.component}
                app={appProps}
              />
            </Permission>
          </Layout>
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { redirect: location } }}
          />
        );
      };
      const key = i;

      return <Route key={key} exact path={route.path} render={renderFn} />;
    } else {
      const renderFn = (): any => {
        return (
          <AsyncLoader
            type={route.type}
            path={route.component}
            app={appProps}
          />
        );
      };
      const key = i;

      return <Route exact key={key} path={route.path} render={renderFn} />;
    }
  });

  const NotFound = (): any => (
    <Layout app={appProps}>
      <div>404</div>
    </Layout>
  );

  return (
    <HashRouter>
      <Switch>
        {renderRoutes}
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  );
}

export default createRouterConfig;
