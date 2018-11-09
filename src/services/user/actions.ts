import { isWeb } from '../../utils';
import { getItem, removeItem, setItem } from '../utils/storage';

export const getKeyName = () =>
  isWeb ? location.host + '.user' : 'sales-cloud.user';

export const saveUser = (user): void => {
  setItem(getKeyName(), user);
};

export const getUser = async (): Promise<any> => {
  const value = await getItem(getKeyName());

  return JSON.parse(value || '{}');
};

export const getUserByWeb = (): any => {
  return JSON.parse(localStorage.getItem(getKeyName()) || '{}');
};

export const removeUser = (): void => {
  removeItem(getKeyName());
};
