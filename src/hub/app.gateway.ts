import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
    WsResponse,
  } from '@nestjs/websockets';

  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({namespace: '/appgateway'})
  export class AppGateway implements OnGatewayInit, OnGatewayConnection {
    
    @WebSocketServer() server: Server;

    // @SubscribeMessage('createRoom')
    // public handleCreateRoom(client: Socket, data: any) {


    // }

    /// watchers
    public afterInit(server: Server): void {
      return console.log("init");
    }
  
  
    public handleConnection(client: Socket): void {
        console.log(`Client connected: ${client.id}`);
        client.join(client.id);
    }

  }