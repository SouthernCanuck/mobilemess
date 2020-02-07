import { FieldValueMap } from 'types/fieldValue';
import { getSectionFieldPath, getFieldId } from 'helpers/fieldValue';
import { WorkOrderFields } from 'types/orderFields';

import {
  ADDRESS,
  CITY,
  STATE,
  ZIP_CODE,
  APPOINTMENT,
  DUE_DATE,
  UNIT_NUMBER,
  FILE_NUMBER,
  ORDER_CONTACT_NAME,
  ORDER_CONTACT_PHONE,
} from 'config/inspectionConfig';
import { ORDER_INFORMATION } from 'constants/sectionNames';
import { getValue } from 'helpers/multiValues';

export const getOrderValue = (values: FieldValueMap, definitionId: string): string => {
  const path = getSectionFieldPath(
    ORDER_INFORMATION,
    0,
    definitionId,
  );
  const fieldId = getFieldId(path);
  const value = getValue(values, fieldId) as string;

  return value;
};

export const getOrderFields = (values: FieldValueMap): WorkOrderFields => (
  {
    appointment: getOrderValue(values, APPOINTMENT),
    dueDate: getOrderValue(values, DUE_DATE),
    contactName: getOrderValue(values, ORDER_CONTACT_NAME),
    contactPhone: getOrderValue(values, ORDER_CONTACT_PHONE),
    generalFileNumber: getOrderValue(values, FILE_NUMBER),
    generalAddress: getOrderValue(values, ADDRESS),
    unitNumber: getOrderValue(values, UNIT_NUMBER),
    generalAddressCity: getOrderValue(values, CITY),
    generalAddressState: getOrderValue(values, STATE),
    generalAddressZip: getOrderValue(values, ZIP_CODE),
  }
);
