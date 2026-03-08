import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ValidateTokenResult {
  @ApiProperty({ type: () => User })
  user!: User;

  @ApiProperty({ example: 'new.jwt.token', required: false })
  newToken?: string;
}
