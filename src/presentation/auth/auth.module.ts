import { Module } from '@nestjs/common';
import { AuthModule as InfraAuthModule } from 'src/infrastructure/auth/auth.module';

@Module({
  imports: [InfraAuthModule],
})
export class AuthModule {}
