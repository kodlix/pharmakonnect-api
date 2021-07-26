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
   
   @WebSocketGateway({namespace: '/notigateway'})
   export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
   
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('NotificationGateway');
   
    @SubscribeMessage('notimsgToServer')
    handleMessage(client: Socket, payload: any): void {
      
      client.join(payload.socketId);
    //  this.server.to(payload.recieverId).emit('msgToClient', payload);
    }
   
    sendToUser(data: any, to: string) {
      this.server.to(to).emit('notimsgToClient', data);
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