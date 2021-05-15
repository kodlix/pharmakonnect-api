import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class ClickService implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const allowedIp: Array<string> = ['129.2.2.2', '129.2.2.2'];
      if (process.env.ENV === 'production') {
        const ip = request.connection.remoteAddress;
        Logger.log(ip, 'ACCESSED IP ADDRESS');
        if (allowedIp.includes(ip)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }