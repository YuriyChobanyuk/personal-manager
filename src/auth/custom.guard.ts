import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';

@Injectable()
export class RestrictedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    console.log('created');
  }
  public canActivate(context: ExecutionContext): boolean {
    const user: User = context.switchToHttp().getRequest().user;

    const roles = this.reflector.get<Role[]>('roles', context.getHandler())

    console.log({ user, roles });

    return roles.includes(Role.ADMIN);
  }
}
