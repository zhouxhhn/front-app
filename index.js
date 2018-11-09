import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
// import { configure } from 'mobx';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { name as appName } from './app.json';
import routes from './src/routes';
import createRouterConfig from './src/router.native';
import AuthLoadingScreen from './src/containers/auth-loading';
import Login from './src/containers/login';
import { setTopLevelNavigator, navigate } from './src/utils/navigation.android';

// configure({ enforceActions: 'observed' });

global.app = {
  push: navigate,
};

const AppStack = createRouterConfig(routes);
const AuthStack = createStackNavigator(
  { SignIn: Login },
  { headerMode: 'none' }
);

const App = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    AppIndex: AppStack,
    Login: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
  }
);

// eslint-disable-next-line
class MainApp extends Component {
  render() {
    return (
      <App
        ref={navigatorRef => {
          setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

AppRegistry.registerComponent(appName, () => MainApp);
