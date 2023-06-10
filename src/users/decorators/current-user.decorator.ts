import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description Get currently logged in user
 * @notice ParamDecorator exist outside the DI system(cannot get an instance of a service layer)
 * - SOLUTION: use interceptor + decorator
 * - interceptor is inside DI system (access to service layer)
 * @see {current-user.interceptor.ts}
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // context: incoming request, wrapper (http, websocket, etc)
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
