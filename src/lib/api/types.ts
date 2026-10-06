export enum ResponseStatus {
  Success = 'success',
  Failure = 'failure',
}

export interface INextApiResponse<T = any> {
  statusCode?: number;
  status: ResponseStatus;
  data?: T;
  message?: string;
}
