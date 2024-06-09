import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameModule as DomainGameModule } from 'src/domain/game/game.module';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';

@Module({
  imports: [DomainGameModule, PersistenceModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
