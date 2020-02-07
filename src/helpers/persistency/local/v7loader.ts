import * as t from 'io-ts';
import WorkOrderType from 'types/workOrderType';
import InspectionType from 'types/inspectionType';
import WorkOrderStatus from 'types/workOrderStatus';
import { toLiterals } from '../literals';
import { ReadData } from './types';

const Order = t.intersection([
  t.type({
    internalId: t.string,
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
    inspectionId: t.string,
    inspectionType: toLiterals(Object.values(InspectionType)),
    expiration: t.string,
  }),
]);

const OrderData = t.intersection([
  t.type({
    order: Order,
  }),
  t.partial({
    sketch: t.object,
  }),
]);

export const PersistentData = t.type({
  version: t.literal(7),
  orders: t.array(OrderData),
});

export type PersistentData = t.TypeOf<typeof PersistentData>

export const loader = (data: PersistentData): ReadData => ({
  orders: data.orders.map(({ order, sketch }) => ({
    order: {
      ...order,
      appointment: new Date(order.appointment),
      dueDate: new Date(order.dueDate),
      expiration: order.expiration ? new Date(order.expiration) : undefined,
    },
    sketch,
  })),
});
