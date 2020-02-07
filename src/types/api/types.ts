/* eslint-disable @typescript-eslint/camelcase */
import * as t from 'io-ts';

export const Adress = t.type({});

export const ApiListInspection = t.type({
  order_id: t.string,
  userSuppliedOrderId: t.string,
  address: Adress,
  status: t.string,
});

export type ApiListInspection = t.TypeOf<typeof ApiListInspection>

export const ApiInspection = t.type({
  assigned_user: t.string,
  inspect_id: t.string,
  inspect_json: t.string,
  is_active: t.boolean,
  status: t.string,
});

export type ApiInspection = t.TypeOf<typeof ApiInspection>

export interface InspectionPayload {
  inspect_json: string;
  assigned_user: string;
  status: string;
}

export type InspectionId = string;

export type OrderId = string;

export type InspectionStatus = 'Distributed' | 'Assigned' | 'InProgress' | 'Completed' | 'Rejected';
