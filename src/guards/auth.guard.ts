import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * @summary If not signed in, throw an error(403 Forbidden)
 */
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
