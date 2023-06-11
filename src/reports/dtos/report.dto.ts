import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';

/**
 * @description DTO that describes how to serialize a report
 * @default Report Response
 */

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Expose()
  mileage: number;

  // Add foreign key(user.id)
  @Transform(({ obj }) => obj.user.id) // original entity (report)
  @Expose()
  userId: number;
}
