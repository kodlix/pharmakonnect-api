import { createParamDecorator } from '@nestjs/common';
import { AccountEntity } from 'src/account/entities/account.entity';

export const GetCurrentUser = createParamDecorator((data, req): AccountEntity => {
  return req.user;
});