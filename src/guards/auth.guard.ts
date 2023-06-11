import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * @response 403 Forbidden
 * @summary
 * If not signed in, throw an error
 * Authentication: Figure out who is making a request.
 */
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
