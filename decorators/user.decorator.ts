import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;

    const token = (authHeaders as string).split(' ')[1];

    const decoded: any = jwt.verify(token, 'cats');

    return decoded;
  },
);
