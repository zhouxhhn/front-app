import React from 'react';
import { View, Text } from 'react-native';
import Button from '@sipin/sipin-sales-cloud-components/src/components/input-with-button/button';
import { observer } from 'mobx-react/native';
import DayPicker from './day-picker';
import DatePicker from './date-picker';
import * as styles from '../../../utils/styles';
import searchBarStore from './store';

interface IProps {
  onSubmit?: (value: any) => void;
}

interface IState {}

@observer
class SearchBar extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(searchBarStore.params);
    }
  };

  onMinDateChange = value => {
    searchBarStore.setMinDate(value);
  };
  onMaxDateChange = value => {
    searchBarStore.setMaxDate(value);
  };

  onDayChange = value => {
    searchBarStore.setDay(value);
  };

  render() {
    const { minDate, maxDate, day } = searchBarStore;
    const textStyle = { height: 28, lineHeight: 29 };

    return (
      <View style={[styles.style.flexRow, styles.style.mb15]}>
        <View>
          <Text style={textStyle}>选择查询时间：</Text>
        </View>
        <View style={{ width: 200, marginLeft: 10 }}>
          <DayPicker value={day} onChange={this.onDayChange} />
        </View>
        <View style={{ width: 200, marginLeft: 10 }}>
          <DatePicker
            onChange={this.onMinDateChange}
            value={minDate}
            maxDate={maxDate}
          />
        </View>
        <View>
          <Text style={[textStyle, { marginLeft: 10 }]}>至</Text>
        </View>
        <View style={{ width: 200, marginLeft: 10 }}>
          <DatePicker
            minDate={minDate}
            onChange={this.onMaxDateChange}
            value={maxDate}
          />
        </View>
        <View style={{ width: 100, marginLeft: 10 }}>
          <Button buttonText="查询" onClick={this.handleSubmit} />
        </View>
      </View>
    );
  }
}

export default SearchBar;
