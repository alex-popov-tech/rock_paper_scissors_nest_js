import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { JwtModule } from '../jwt.module';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [PersistenceModule, PassportModule, JwtModule],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
