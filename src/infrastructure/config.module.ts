import { ConfigModule as NestConfigModule } from '@nestjs/config';

// alias to ConfigModule to not register it multiple times
export const ConfigModule = NestConfigModule.forRoot();
