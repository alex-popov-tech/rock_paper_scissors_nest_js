import { Module } from '@nestjs/common';
import { ConfigModule } from './infrastructure/config.module';
import { AuthController } from './presentation/auth/auth.controller';
import { AuthModule } from './presentation/auth/auth.module';
import { GameModule } from './presentation/game/game.module';

@Module({
  imports: [ConfigModule, AuthModule, GameModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
