import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
} from 'react-native';

import WorkOrder from 'types/workOrder';
import { selectors } from 'ducks/workOrders';
import Label from 'components/forms/Label';
import { font } from 'components/elements/typography';
import WorkOrderListElement from './WorkOrderListElement';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  tabWrapper: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#E4E4E6',
  },
  inactiveTab: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E4E6',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#1F4AC0',
  },
  list: {
    flex: 1,
  },
  count: {
    color: '#1F4AC0',
    ...font.semibold,
  },
});

const Count: React.FC = ({ children }) => <Text style={styles.count}>{children}</Text>;

interface StateProps {
  newOrders: WorkOrder[];
  inProgressOrders: WorkOrder[];
  sentOrders: WorkOrder[];
}
type Props = StateProps;

interface State {
  tab: number;
}
class WorkOrderList extends React.Component<Props, State> {
  public constructor(props: any) {
    super(props);
    this.state = { tab: 0 };
  }

  private changeTab = (tab: number) => {
    this.setState({ tab });
  }

  private renderOrders = () => {
    const { newOrders, inProgressOrders, sentOrders } = this.props;
    const orders = [newOrders, inProgressOrders, sentOrders][this.state.tab];
    return orders.map((order: WorkOrder) => (
      <WorkOrderListElement key={order.internalId} order={order} />
    ));
  }

  public render() {
    const { tab } = this.state;
    const { newOrders, inProgressOrders, sentOrders } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            onPress={() => this.changeTab(0)}
            style={[styles.tab, tab === 0 ? styles.activeTab : styles.inactiveTab]}
          >
            <Count>{newOrders.length}</Count>
            <Label>New</Label>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => this.changeTab(1)}
            style={[styles.tab, tab === 1 ? styles.activeTab : styles.inactiveTab]}
          >
            <Count>{inProgressOrders.length}</Count>
            <Label>In Progress</Label>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => this.changeTab(2)}
            style={[styles.tab, tab === 2 ? styles.activeTab : styles.inactiveTab]}
          >
            <Count>{sentOrders.length}</Count>
            <Label>Sent</Label>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.list}>
          {this.renderOrders()}
        </ScrollView>
      </View>
    );
  }
}
export default connect<StateProps, {}>(
  (state: any) => ({
    newOrders: selectors.getNewOrders(state),
    inProgressOrders: selectors.getInProgressOrders(state),
    sentOrders: selectors.getSentOrders(state),
  }),
)(WorkOrderList);
