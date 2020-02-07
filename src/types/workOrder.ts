import WorkOrderType from './workOrderType';
import WorkOrderStatus from './workOrderStatus';
import InspectionType from './inspectionType';

interface WorkOrder {
  internalId: string;
  inspectionId?: string;
  workOrderType: WorkOrderType;
  inspectionType?: InspectionType;
  status: WorkOrderStatus;
  address: string;
  appointment: Date;
  dueDate: Date;
  expiration?: Date;
  summary: string;
  client: string;
  phoneNumber: string;
  inspectionData: object;
  lastRemoteSave: number;
  lastLocalChange: number;
}

export default WorkOrder;
