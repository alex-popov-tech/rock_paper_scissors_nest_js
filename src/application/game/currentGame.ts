type FinishedGameStatus = 'draw' | 'win' | 'aborted';
type UnfinishedGameStatus = 'in-progress' | 'created';
type GameStatus = FinishedGameStatus | UnfinishedGameStatus;

interface PlayerSelection {
  id: number;
  option?: 'rock' | 'paper' | 'scissors' | 'leave';
}

interface Game {
  firstPlayer: PlayerSelection;
  secondPlayer: PlayerSelection;
  winner: PlayerSelection;
  status: GameStatus;
}

const DEFAULT_GAME: Game = {
  firstPlayer: null,
  secondPlayer: null,
  winner: null,
  status: 'created',
};

export class CurrentGame {
  private currentGame: Game = {...DEFAULT_GAME};

  get state() {
    return this.currentGame;
  }

  update(patch: Game) {
    this.currentGame = { ...this.currentGame, ...patch };
    return this.currentGame;
  }

  wipeout() {
    this.currentGame = { ...DEFAULT_GAME};
    return this.currentGame;
  }

  dropOptions() {
    const game = { ...this.currentGame };
    this.currentGame = {
      ...DEFAULT_GAME,
      firstPlayer: { id: game.firstPlayer.id },
      secondPlayer: { id: game.secondPlayer.id },
    };
    return this.currentGame;
  }
}
