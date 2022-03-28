import { AxiosResponse, AxiosError } from 'axios';

export interface AppServerErrorResponse {
  error?: string;
  message?: string;
  statusCode?: string;
}

export type AppServerResponseOrError =
  | [AxiosResponse<any, any>, null]
  | [null, AxiosError<any, any>];


export type AlertVariant = 'info' | 'error' | 'success' | 'warning';