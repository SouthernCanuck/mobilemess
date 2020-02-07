import { apiConfig } from 'config/apiConfig';
import { HttpMethod } from 'types/httpMethod';
import { HttpStatus } from 'types/httpStatus';

export const makeApiRequest = async (
  accessToken: string,
  method: HttpMethod,
  url: string,
  payload?: object,
): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const fullUrl = `${apiConfig.baseUrl}${url}`;
  const requestInit: RequestInit = {
    method,
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }),
  };
  if (payload) {
    requestInit.body = JSON.stringify(payload);
  }
  const response: Response = await fetch(fullUrl, requestInit);

  if (response.status >= HttpStatus.ERROR) {
    try {
      const json = await response.json();
      console.error('API failed:', response.status, fullUrl, payload, method, json); // eslint-disable-line no-console
      throw new Error(`Server error: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
    } catch (e) {
      console.error('API failed:', response.status, fullUrl, payload, method, e); // eslint-disable-line no-console
      throw new Error('Can\'t read response from server');
    }
  }

  if (response.status === HttpStatus.NO_CONTENT) {
    // no content
    return null;
  }

  try {
    return await response.json();
  } catch (e) {
    console.error('Wrong json from API:', e); // eslint-disable-line no-console
    throw new Error('Can\'t read response from server');
  }
};
