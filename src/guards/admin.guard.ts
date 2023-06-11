import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * @response 403 Forbidden
 * @summary
 * Authorization: Figure out if the person making the request is allowed to make it.
 */
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { currentUser } = request;
    if (!currentUser) {
      return false;
    }
    return currentUser.admin;
  }
}
