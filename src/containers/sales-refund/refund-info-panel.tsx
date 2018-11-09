import React from 'react';
import { Text, Button } from 'react-native';
import { observer } from 'mobx-react/native';
import InfoPanel from '@sipin/sipin-sales-cloud-components/src/components/info-panel';
import {
  mainColor,
  textColorBase,
} from '@sipin/sipin-sales-cloud-components/src/style/varibles';
import { TextInput, CheckButtonWrap } from './ui';
import store from './store';
import constants from '../../services/constants';
import isSuccess from '../../services/utils/is-success';

const buttonColor = checked => (checked ? mainColor : textColorBase);

@observer
export default class RefundInfoPanel extends React.Component<any> {
  onGoBack = () => {
    const { app } = this.props;
    app.push(`/sales-order/${store.order.no}`);
  };
  submit = async () => {
    const { app } = this.props;
    const res = await store.submit();
    if (isSuccess(res)) {
      app.push(`/sales-refund-list/${res.data.no}`);
    }
  };

  render() {
    const panelData = [
      {
        label: '退款金额:',
        value: `¥${store.refundAmount}`,
      },
      {
        label: '退款数量:',
        value: store.refundQuantity,
      },
    ];

    return (
      <InfoPanel
        data={panelData}
        onGoBack={this.onGoBack}
        onConfirm={this.submit}
        panelName="退货信息"
        confirmText="提 交"
        goBackBtnText="返回"
      >
        <>
          <Text>退款方式:</Text>
          <CheckButtonWrap>
            <Button
              onPress={() => store.updateReturnType(constants.REFUND_TYPE_CASH)}
              color={buttonColor(
                store.returnType == constants.REFUND_TYPE_CASH
              )}
              title={constants.refundType[constants.REFUND_TYPE_CASH]}
            />
            <Button
              onPress={() =>
                store.updateReturnType(constants.REFUND_TYPE_OTHER)
              }
              color={buttonColor(
                store.returnType == constants.REFUND_TYPE_OTHER
              )}
              title={constants.refundType[constants.REFUND_TYPE_OTHER]}
            />
          </CheckButtonWrap>
          <Text>退款原因:</Text>
          <TextInput
            multiline
            editable
            numberOfLines={5}
            placeholder="填写退款原因"
            value={store.reasonNote}
            onChange={(e: any) => store.updateNote(e)}
          />
        </>
      </InfoPanel>
    );
  }
}
