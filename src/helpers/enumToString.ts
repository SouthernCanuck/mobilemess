import WorkOrderStatus from 'types/workOrderStatus';
import InspectionType from 'types/inspectionType';

export const orderStatusToString = (status: WorkOrderStatus): string => {
  switch (status) {
    case WorkOrderStatus.AVAILABLE:
      return 'Available';
    case WorkOrderStatus.REVISION:
      return 'Revision';
    case WorkOrderStatus.SCHEDULED:
      return 'Scheduled';
    case WorkOrderStatus.UNSCHEDULED:
      return 'Unscheduled';
    case WorkOrderStatus.IN_PROGRESS:
      return 'In Progress';
  }
  return '';
};

export const inspectionTypeToString = (inspectionType: InspectionType): string => {
  switch (inspectionType) {
    case InspectionType.SINGLE_FAMILY:
      return 'Single Family';
  }
  return '';
};
