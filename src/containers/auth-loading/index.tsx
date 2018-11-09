import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
// import { getUser } from '../../services/user/actions';

export default class AuthLoading extends React.Component<any> {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const { navigation } = this.props;
    // const userInfo = await getUser();
    // navigation.navigate(userInfo.token ? 'AppIndex' : 'Login');
    navigation.navigate('AppIndex');
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
