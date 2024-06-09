import { Module } from '@nestjs/common';
import { GameModule as AppGameModule } from 'src/application/game/game.module';
import { GameGateway } from './game.gateway';
import { JwtModule } from 'src/infrastructure/jwt.module';

@Module({
  imports: [AppGameModule, JwtModule],
  providers: [GameGateway],
})
export class GameModule {}
