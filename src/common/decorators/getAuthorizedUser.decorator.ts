import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../auth/user.entity';

export const GetAuthorizedUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
