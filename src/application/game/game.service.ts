import { Injectable } from '@nestjs/common';
import { GameService as DomainGameService } from 'src/domain/game/game.service';
import { CurrentGame } from './currentGame';
import { PrismaService } from 'src/infrastructure/persistence/prisma.service';
import { GameStatus } from '@prisma/client';

@Injectable()
export class GameService {
  // tmp solution to keep global state of single game
  // in potential future can be moved to separate service
  private currentGame = new CurrentGame();

  constructor(
    private readonly domainGameService: DomainGameService,
    private readonly prismaService: PrismaService,
  ) {}

  onConnect(playerId: number) {
    const updatedGame = this.domainGameService.join({
      game: this.currentGame.state,
      newPlayerId: playerId,
    });
    this.currentGame.update(updatedGame);
  }

  onDisconnect(playerId: number) {
    const game = this.domainGameService.leave({
      game: { ...this.currentGame.state },
      playerId,
    });
    if (game.status === 'aborted') {
      this.currentGame.wipeout();
    }
    // following if's is kinda odd, but its 2:34, and i can't think of better solution
    // hope will come up with something better in the morning
    // UPDATED: Jun 11 13:38 - im alright now, but still can't figure out more elegant solution
    // and deadlines are coming up, so i just leave it here and then will fix after sending to review
    if (game.firstPlayer?.option === 'leave') {
      this.currentGame.dropOptions();
      this.currentGame.update({
        ...game,
        firstPlayer: null,
        secondPlayer: game.secondPlayer,
      });
    }
    if (game.secondPlayer?.option === 'leave') {
      this.currentGame.dropOptions();
      this.currentGame.update({
        ...game,
        secondPlayer: null,
        firstPlayer: game.firstPlayer,
      });
    }
    return game;
  }

  async onAction(
    playerId: number,
    action: { option: 'rock' | 'paper' | 'scissors' | 'leave' },
  ) {
    const game = this.domainGameService.choose({
      game: this.currentGame.state,
      playerSelection: { id: playerId, ...action },
    });
    if (!['draw', 'win'].includes(game.status)) {
      this.currentGame.update(game);
      return { game, isFinished: false };
    } else {
      await this.prismaService.gameHistory.create({
        data: {
          firstPlayerId: game.firstPlayer.id,
          secondPlayerId: game.secondPlayer.id,
          status: game.status.toUpperCase() as GameStatus,
          winnerId: game.status !== 'draw' ? game.winner.id : undefined,
        },
      });
      this.currentGame.dropOptions();
      return { game, isFinished: true };
    }
  }
}
