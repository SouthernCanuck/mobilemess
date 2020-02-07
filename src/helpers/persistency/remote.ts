/* eslint-disable @typescript-eslint/camelcase */
import WorkOrder from 'types/workOrder';
import { InspectionPayload, ApiInspection } from 'types/api/types';

export const NOT_SAVED = 0;

export const formatInspectionForAPI = ({
  internalId,
  inspectionId,
  status,
  lastLocalChange,
  lastRemoteSave,
  ...inspection
}: WorkOrder): InspectionPayload => ({
  inspect_json: JSON.stringify(inspection),
  assigned_user: 'TODO',
  status,
});

export const readInspectionFromAPI = (inspection: ApiInspection): Omit<WorkOrder, 'internalId'> => {
  const now = Date.now();
  return {
    ...JSON.parse(inspection.inspect_json),
    // assigned_user: inspection.assigned_user,
    // is_active: inspection.is_active,
    inspectionId: inspection.inspect_id,
    status: inspection.status,
    lastLocalChange: now,
    lastRemoteSave: now,
  };
};
