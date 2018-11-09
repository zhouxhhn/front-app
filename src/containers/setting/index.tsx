import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react/native';
import { Tabs } from '@sipin/sipin-sales-cloud-components/src/components';
import styled from 'styled-components/native';
import store from './store';
import { TAB_PRINTER, TAB_PRINT_INFO, TAB_POS, TAB_OPTIONS } from './constant';
import POS from './pos';
import PrintInfo from './print-info';
import Printer from './printer';
import { MainBlock } from '../../components/block';
import Panel from './panel';
import { getUser } from '../../services/user/actions';

const PanelWrapper = styled.View`
  height: 100%;
  background-color: #fff;
`;

@observer
class Settings extends React.Component<any> {
  async componentDidMount() {
    const user = await getUser();
    const { setting } = user;

    store.setForm({
      ...setting,
      printerType: setting.printerType ? [setting.printerType] : [],
      posType: setting.posType ? [setting.posType] : [],
      printer: setting.printer ? [setting.printer] : [],
    });
  }

  render() {
    Object.keys(toJS(store.form)).forEach(item => item);
    let tabContent: any = null;
    switch (store.tab) {
      case TAB_PRINTER:
        tabContent = <Printer store={store} />;
        break;
      case TAB_PRINT_INFO:
        tabContent = <PrintInfo store={store} />;
        break;
      case TAB_POS:
        tabContent = <POS store={store} />;
        break;
    }

    return (
      <MainBlock>
        <Tabs
          tabs={TAB_OPTIONS}
          initialPage={store.tab}
          page={store.tab}
          onChange={(tab, index) => {
            store.setTab(index);
          }}
          animated={false}
          swipeable={false}
        >
          <PanelWrapper>
            <Panel title={TAB_OPTIONS[store.tab].title}>{tabContent}</Panel>
          </PanelWrapper>
        </Tabs>
      </MainBlock>
    );
  }
}
export default Settings;
