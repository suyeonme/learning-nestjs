import { Expose } from 'class-transformer';

/**
 * @description DTO that describes how to serialize a user for this particular route handler
 * @default User Response
 */

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}