import { AsyncStorage } from 'react-native';
import { isString, isWeb } from '../../utils';

export const setItem = (key: string, value: any) => {
  const storage = isWeb ? localStorage : AsyncStorage;
  const val = isString(value) ? value : JSON.stringify(value);

  return isWeb
    ? Promise.resolve(storage.setItem(key, val))
    : storage.setItem(key, val);
};

export const removeItem = (key: string) => {
  const storage = isWeb ? localStorage : AsyncStorage;

  return isWeb
    ? Promise.resolve(storage.removeItem(key))
    : storage.removeItem(key);
};

export const getItem = (key: string): any => {
  const storage = isWeb ? localStorage : AsyncStorage;

  return isWeb ? Promise.resolve(storage.getItem(key)) : storage.getItem(key);
};
