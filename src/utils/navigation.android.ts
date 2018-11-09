import { NavigationActions } from 'react-navigation';

let _navigator;

/**
 * setTopLevelNavigator
 * @param {*} navigatorRef ref
 * @returns {void}
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

/**
 * navigate
 * @param {*} routeName routeName
 * @param {*} params params
 * @returns {void}
 */
function navigate(routeName, params = {}) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

export { navigate, setTopLevelNavigator };
