import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

export const historyPush = (path: string, state?: any): void => {
  history.push(path, state);
};

export const historyGoBack = (path?: string): void => {
  if (path) {
    history.length ? history.go(-1) : history.push(path);
  } else {
    history.go(-1);
  }
};
