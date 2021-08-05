import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
 import { Logger } from '@nestjs/common';
 import { Socket, Server } from 'socket.io';
import { AccountEntity } from 'src/account/entities/account.entity';
 
 @WebSocketGateway({namespace: '/chatgateway'})
 export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
 
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
 
  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    
    client.join(payload.socketId);
  //  this.server.to(payload.recieverId).emit('msgToClient', payload);
  }
 
  sendToUser(data: any, user: AccountEntity) {
    this.server.to(user.id === data.initiatorId ? data.counterPartyId : data.initiatorId).emit('msgToClient', data);
  }

  sendToGroupChatUser(data: any, user: AccountEntity) {
    const usersToMsg = data.participants.filter(x => x.accountId != user.id);
    for(const us of usersToMsg){
      this.server.to(us.accountId).emit('msgToClient', data); 
    }
  }

  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
   this.logger.log(`Client disconnected: ${client.id}`);
  }
 
  handleConnection(client: Socket) {
   this.logger.log(`Client connected: ${client.id}`);
  }
 }