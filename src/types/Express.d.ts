import "express";
export interface AuthJwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}
