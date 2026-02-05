import { PrismaClient } from '../generated';
import { TokenPayload } from '../utils/jwt.utils';

declare global {
  namespace Express {
    interface Request {
      db?: PrismaClient;
      user?: TokenPayload;
    }
  }
}
