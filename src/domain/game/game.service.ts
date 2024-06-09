import { Injectable } from '@nestjs/common';
import { Game, GameResult, PlayerSelection } from './types';

@Injectable()
export class GameService {
  join({ game, newPlayerId }: { game: Game; newPlayerId: number }): Game {
    // it might be better to have an array of players
    // now limited to 2 players, it would make db schema better
    // and simplify future change to players count
    // but i wasn't sure its premature optimization kinda case
    if (!game.firstPlayer) {
      game.firstPlayer = { id: newPlayerId };
      return game;
    }
    if (!game.secondPlayer) {
      game.secondPlayer = { id: newPlayerId };
      return game;
    }

    throw new Error('Game is already in progress');
  }

  leave({ game, playerId }: { game: Game; playerId: number }): Game {
    return this.choose({
      game,
      playerSelection: { id: playerId, option: 'leave' },
    });
  }

  choose({
    game,
    playerSelection: currentPlayerSelection,
  }: {
    game: Game;
    playerSelection: PlayerSelection;
  }): Game {
    // mutating game arg looks a bit odd,
    // but i decided that it will be overkill to
    // re-create/deep copy game object both on
    // input and output in domain/application layers
    // so I just did that in application
    const { firstPlayer, secondPlayer } = game;
    (firstPlayer.id === currentPlayerSelection.id
      ? firstPlayer
      : secondPlayer
    ).option = currentPlayerSelection.option;

    // if single person left, abort game
    const players = [firstPlayer, secondPlayer].filter((it) => !!it);
    if (players.length === 1 && players[0].option === 'leave') {
      game.status = 'aborted';
    }

    // if both players make their move, calculate winner
    if (firstPlayer?.option && secondPlayer?.option) {
      const { winner, status } = this.calculateWinner([
        firstPlayer,
        secondPlayer,
      ]);
      game.status = status;
      game.winner = winner;
    }

    return game;
  }

  private calculateWinner([first, second]: [
    PlayerSelection,
    PlayerSelection,
  ]): GameResult {
    if (first.option === second.option) {
      return { status: 'draw', winner: null };
    }
    if (first.option === 'leave') {
      return { status: 'win', winner: second };
    }
    if (second.option === 'leave') {
      return { status: 'win', winner: first };
    }
    const winner =
      {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock',
      }[first.option] === second.option
        ? second
        : first;
    return { winner, status: 'win' };
  }
}
