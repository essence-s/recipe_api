import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    role: string;
    idRole: string;
    userId: number;
  };
}
