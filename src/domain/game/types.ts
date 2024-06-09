type FinishedGameStatus = 'draw' | 'win' | 'aborted';
type UnfinishedGameStatus = 'in-progress' | 'created';
type GameStatus = FinishedGameStatus | UnfinishedGameStatus;
type Option = 'rock' | 'paper' | 'scissors' | 'leave';

export interface PlayerSelection {
  id: number;
  option?: Option;
}

export interface Game {
  firstPlayer: PlayerSelection;
  secondPlayer: PlayerSelection;
  winner: PlayerSelection;
  status: GameStatus;
}

export interface GameResult {
  winner: PlayerSelection;
  status: FinishedGameStatus;
}
