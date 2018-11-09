import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginPage } from '@sipin/sipin-sales-cloud-components/src/components';
import { observer } from 'mobx-react/native';
import { mainColor } from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import store from './store';
import shopStore from '../../services/shop/store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainColor,
  },
});

@observer
class Login extends Component<any> {
  async componentDidMount() {
    const { app } = this.props;
    const res = await store.checkLogin();

    if (res) {
      app.push('/');
    } else {
      return res;
    }
  }

  onSubmit = async data => {
    const { app } = this.props;
    const res = await store.login(data);

    if (res) {
      app.push('/');
    }

    return res;
  };
  render() {
    return (
      <View style={styles.container}>
        <LoginPage
          store={store}
          getShops={async () => await shopStore.getShops()}
          onSubmit={this.onSubmit}
        />
      </View>
    );
  }
}

export default Login;
