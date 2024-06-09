import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule } from './config.module';
import { ConfigService } from '@nestjs/config';

// alias to JwtModule to not register it multiple times
export const JwtModule = NestJwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    };
  },
  inject: [ConfigService],
});
