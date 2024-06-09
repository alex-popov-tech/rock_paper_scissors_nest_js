import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/application/game/game.service';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer() io: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly appGameService: GameService,
  ) {}

  // utility fun, probably better to move it to some toolbox or extend JwtService to be able to do that
  private extractJwt(socket: Socket): { id: number; username: string } {
    if (Object.keys(socket.handshake.auth).length !== 0) {
      // auth before, just return already parsed payload
      return socket.handshake.auth as { id: number; username: string };
    }
    const authHeader = socket.handshake.headers.authorization ?? '';
    const token = authHeader.split(' ')[1];
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  private getUserPayloadById(id: number): { id: number; username: string } {
    const { sockets } = this.io;
    for (const socket of sockets.sockets.values()) {
      if (socket.handshake.auth.id === id) {
        return this.extractJwt(socket);
      }
    }
  }

  // since nest.js cannot apply auth on connection natively
  // we need to customize io server with auth middleware directly
  // https://github.com/nestjs/nest/issues/882
  afterInit() {
    this.io.use((socket, next) => {
      // postman do not support passing auth directly,
      // so since there are no clients now, we pass token through header
      try {
        // add parsed payload to auth to re-use in actual message handlers and not parse again in each
        socket.handshake.auth = this.extractJwt(socket);
        next();
      } catch (err) {
        return next(err);
      }
    });
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Client [${socket.id}] connected`);
    const { id, username } = this.extractJwt(socket);
    try {
      this.appGameService.onConnect(id);
      this.io.emit('onInfo', { message: `${username} joined the game.` });
    } catch (err) {
      socket.emit('onDisconnect', err.message);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client [${socket.id}] disconnected`);
    const { id } = this.extractJwt(socket);

    const game = this.appGameService.onDisconnect(id);
    if (game.status === 'aborted') {
      return;
    }

    const { username: winnerUsername } = this.getUserPayloadById(
      game.winner.id,
    );
    const message = `Game finished with by ${game.status}${game.winner ? ` of ${winnerUsername}` : ''}`;
    this.io.emit('onInfo', { message });
  }

  @SubscribeMessage('choose')
  async handleEvent(
    socket: Socket,
    payload: { option: 'rock' | 'paper' | 'scissors' },
  ) {
    this.logger.log(
      `Client [${socket.id}] incoming message "choose" payload [${payload}]`,
    );

    const { id, username } = this.extractJwt(socket);
    this.io.emit('onInfo', {
      message: `${username} selected ${payload.option}`,
    });
    const { game, isFinished } = await this.appGameService.onAction(
      id,
      payload,
    );

    if (isFinished) {
      const { username: winnerUsername } = this.getUserPayloadById(
        game.winner.id,
      );
      const message = `Game finished with by ${game.status}${game.winner ? ` of ${winnerUsername}` : ''}`;
      this.io.emit('onInfo', { message });
      this.io.disconnectSockets();
    }
  }
}
