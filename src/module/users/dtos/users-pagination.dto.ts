import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UsersPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
