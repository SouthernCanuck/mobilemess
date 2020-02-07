import * as t from 'io-ts';
import WorkOrderType from 'types/workOrderType';
import WorkOrderStatus from 'types/workOrderStatus';
import InspectionType from 'types/inspectionType';
import { ReadData } from './types';
import { toLiterals } from '../literals';

const Order = t.intersection([
  t.type({
    orderId: t.string,
    workOrderType: toLiterals(Object.values(WorkOrderType)),
    status: toLiterals(Object.values(WorkOrderStatus)),
    address: t.string,
    appointment: t.string,
    dueDate: t.string,
    summary: t.string,
    client: t.string,
    phoneNumber: t.string,
    inspectionData: t.object,
    lastRemoteSave: t.number,
    lastLocalChange: t.number,
  }),
  t.partial({
    inspectionType: toLiterals(Object.values(InspectionType)),
    expiration: t.string,
  }),
]);

export const Orders = t.type({
  orders: t.array(Order),
});

export const PersistentData = t.type({
  version: t.literal(4),
  orders: Orders,
});

export type PersistentData = t.TypeOf<typeof PersistentData>

export const loader = (data: PersistentData): ReadData => ({
  orders: data.orders.orders.map(({ orderId, ...order }) => ({
    order: {
      ...order,
      internalId: orderId,
      appointment: new Date(order.appointment),
      dueDate: new Date(order.dueDate),
      expiration: order.expiration ? new Date(order.expiration) : undefined,
    },
  })),
});
