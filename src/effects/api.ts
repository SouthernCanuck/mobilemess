import * as t from 'io-ts';
import { apiConfig } from 'config/apiConfig';
import { HttpMethod } from 'types/httpMethod';
import { makeApiRequest } from 'effects/request';
import {
  InspectionId, ApiInspection, ApiListInspection, InspectionPayload, OrderId, InspectionStatus,
} from 'types/api/types';
import createValidator from 'helpers/validation';

const validateListData = createValidator(t.array(ApiListInspection));
const validateGetData = createValidator(ApiInspection);

export const listInspections = async (
  accessToken: string, assignedToUserEmail: string, companyKey: string,
): Promise<ApiListInspection[]> => {
  const response = await makeApiRequest(
    accessToken,
    HttpMethod.POST,
    `${apiConfig.inspection}/${apiConfig.available}`,
    {
      assignedToUserEmail,
      companyKey,
    },
  );
  return validateListData(response);
};

export const createInspection = async (accessToken: string, inspection: InspectionPayload): Promise<InspectionId> => {
  const response = await makeApiRequest(
    accessToken,
    HttpMethod.POST,
    `${apiConfig.inspection}`,
    inspection,
  );
  if (typeof response !== 'string') {
    throw new Error('Expected inspectionId from server');
  }
  return response;
};

export const updateInspection = (
  accessToken: string, inspectionId: InspectionId, inspection: InspectionPayload,
): Promise<unknown> => (
  makeApiRequest(
    accessToken,
    HttpMethod.PUT,
    `${apiConfig.inspection}/${inspectionId}`,
    inspection,
  )
);

export const getInspection = async (accessToken: string, inspectionId: InspectionId): Promise<ApiInspection> => {
  const response = await makeApiRequest(
    accessToken,
    HttpMethod.GET,
    `${apiConfig.inspection}/${inspectionId}`,
  );
  return validateGetData(response);
};

export const enableInspection = async (accessToken: string, inspectionId: InspectionId): Promise<ApiInspection> => {
  const response = await makeApiRequest(
    accessToken,
    HttpMethod.PUT,
    `${apiConfig.inspection}/${inspectionId}/${apiConfig.enable}`,
  );
  return validateGetData(response);
};

export const disableInspection = async (accessToken: string, inspectionId: InspectionId): Promise<ApiInspection> => {
  const response = await makeApiRequest(
    accessToken,
    HttpMethod.PUT,
    `${apiConfig.inspection}/${inspectionId}/${apiConfig.disable}`,
  );
  return validateGetData(response);
};

export const changeInspectionStatus = async (
  accessToken: string, orderId: OrderId, status: InspectionStatus,
): Promise<unknown> => (
  makeApiRequest(
    accessToken,
    HttpMethod.PUT,
    `${apiConfig.inspection}/${orderId}/${apiConfig.status}`,
    {
      orderId,
      status,
    },
  )
);
