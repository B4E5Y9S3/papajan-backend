export class AppError extends Error {
  public statusCode: number;
  public ok: boolean;
  public code: string;
  public isOperational: boolean;
  public details?: undefined | string | object | Array<object | string>;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: undefined | string | object | Array<object | string>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.ok = false;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
