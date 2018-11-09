import React from 'react';
import { ScrollView } from 'react-native';
import { toJS } from 'mobx';
import { Toast } from '@sipin/sipin-sales-cloud-components/src/components';
import Sum from './sum';
import Flow from './flow';
import Wrapper from './wrapper';
import BottomPanel from './bottom-panel';
import {
  getSalesPaymentSum,
  salesPaymentIndexApi,
} from '../../services/statement/actions';
import { CONTENT_HEIGHT } from '../../utils/constants';
import SearchBar from './search-bar';
import searchBarStore from './search-bar/store';
import Store from '../../services/list/store';
import statementPrint from './print';

interface IProps {
  app: any;
}

interface IState {
  activeIndex: number;
  backPaymentList: any[];
  receivePaymentList: any[];
  totalCount: number;
  totalPrice: number;
}

export default class StateMent extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      backPaymentList: [],
      receivePaymentList: [],
      totalCount: 0,
      totalPrice: 0,
    };

    this.store = new Store({ apis: { getList: salesPaymentIndexApi } });
    this.store.size = 20;
  }

  async componentDidMount() {
    Toast.loading('加载中', 0);
    searchBarStore.setDay(['today']);
    await this.fetchData(searchBarStore.params);
    Toast.hide();
  }

  fetchData = async (params = {}) => {
    const res = await getSalesPaymentSum(params);
    if (res.error) {
      Toast.fail(res.error);

      return;
    }

    this.setState({
      backPaymentList: res.backPaymentList || [],
      receivePaymentList: res.receivePaymentList || [],
      totalCount: res.totalCount || 0,
      totalPrice: res.totalPrice || 0,
    });
  };

  handleTabClick = (index: number) => {
    this.setState({
      activeIndex: index,
    });
  };

  handleSearchSubmit = value => {
    this.fetchData(value);
    this.store.getList({ page: 1, params: value });
  };

  print = (title, activeIndex, data) => {
    statementPrint(title, activeIndex, data);
  };

  printSum = () => {
    const {
      activeIndex,
      backPaymentList,
      receivePaymentList,
      totalCount,
      totalPrice,
    } = this.state;

    this.print('对帐汇总单', activeIndex, {
      backPaymentList,
      receivePaymentList,
      totalCount,
      totalPrice,
    });
  };

  printFlow = () => {
    const { activeIndex, totalCount, totalPrice } = this.state;

    const dataSource = toJS(this.store.dataSource);

    this.print('对账明细单', activeIndex, {
      dataSource,
      totalCount,
      totalPrice,
    });
  };

  store;

  render() {
    const {
      activeIndex,
      backPaymentList,
      receivePaymentList,
      totalCount,
      totalPrice,
    } = this.state;
    const { app } = this.props;

    return (
      <Wrapper
        app={app}
        activeIndex={activeIndex}
        onChange={this.handleTabClick}
      >
        {activeIndex === 0 ? (
          <ScrollView style={{ height: CONTENT_HEIGHT - 75 - 65, padding: 20 }}>
            <SearchBar onSubmit={this.handleSearchSubmit} />
            <Sum
              backPaymentList={backPaymentList}
              receivePaymentList={receivePaymentList}
            />
          </ScrollView>
        ) : (
          <Flow store={this.store} fetchSumData={this.fetchData} />
        )}
        <BottomPanel
          totalCount={totalCount}
          totalPrice={totalPrice}
          onPrint={activeIndex === 0 ? this.printSum : this.printFlow}
        />
      </Wrapper>
    );
  }
}
