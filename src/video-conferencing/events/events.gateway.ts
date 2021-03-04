import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';

  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({namespace: '/stream'})
  export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer() server: Server;
    rooms: Array<any> = [];
    users: any = {};
    roomUsers: Array<any> = [];


    @SubscribeMessage('subscribe')
    public handleSubscribe(client: Socket, data: any) {

        //check if room is in use by other conferencers
        const isRooMInUse = this.rooms.find(x => x.room.toLowerCase() === data.room.split("_")[0].toLowerCase());
        if(isRooMInUse) {
            return this.server.emit( 'roomExist', {message: `The room "${isRooMInUse.room}" is in use.` } );
        }

        //create a room
        client.join( data.room );
        client.join( data.socketId );

        // store user connection id as key and name/room as value
        this.users[data.socketId] = `${data.user}*${data.room}`;
        
        //push user to room users
        this.roomUsers.push(data.user);

        //create a data store for the current room and its users
        let roomObj = {
            room: data.room.split("_")[0],
            id: data.socketId,
            users: this.roomUsers
        }

        this.rooms.push(roomObj);

        this.roomUsers = [];
        
        //Inform other members in the room of new user's arrival
        if ( client.adapter.rooms[data.room].length > 1 ) {
          this.server.to( data.room ).emit( 'new user', { socketId: data.socketId, user: data.user} );
        }

        // callback function called in the client to show participants count
        if ( client.adapter.rooms[data.room].length === 1 ) {
          return { count: this.rooms[this.rooms.length - 1].users.length, name: data.user };
        }

    }

    @SubscribeMessage('join')
    public handleJoinRoom(client: Socket, data: any) {

        //check if room user wants to join is available
        const isRooMAvail = this.rooms.find(x => x.room.toLowerCase() === data.room.split("_")[0].toLowerCase());
        if(!isRooMAvail) {
            return this.server.emit( 'roomDoesNotExist', {  message: 'Meeting has ended or the meeting ID is invalid.' } );
        }

        //join a room
        client.join( data.room );
        client.join( data.socketId );

        this.users[data.socketId] = `${data.user}*${data.room}`;

        let userRoomDetailsIndex = this.rooms.indexOf(isRooMAvail);
        isRooMAvail.users.push(data.user);

        this.rooms[userRoomDetailsIndex] = isRooMAvail;


        //Inform other members in the room of new user's arrival
        if ( client.adapter.rooms[data.room].length > 1 ) {
            this.server.to( data.room ).emit( 'new user', { socketId: data.socketId, user: data.user, userCount: isRooMAvail.users.length, users: isRooMAvail.users } );
        }

    }

    @SubscribeMessage('newUserStart')
    public handleNewUserStart(client: Socket, data: any): void {

        this.server.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    }

    @SubscribeMessage('sdp')
    public handleSDP(client: Socket, data: any): void  {
        this.server.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    }

    @SubscribeMessage('ice candidates')
    public handleIceCandidates(client: Socket, data: any): void  {
        this.server.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    }


    @SubscribeMessage('chat')
    public handleOnChat(client: Socket, data: any): void {
      this.server.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
    }


    /// watchers
    public afterInit(server: Server): void {
      return console.log("init");
    }
  
    public handleDisconnect(client: Socket): void {

      console.log("client disconnected", client.id);

        let room = '';
        client.id = client.id.split('#')[1];
        
        let userName = this.users[client.id];
        delete this.users[client.id];
    
        if(userName) {
            room = userName.split('*')[1].split('_')[0];
        }

        let userRoomDetails = this.rooms.find(x => x.room === room );
        
        if(userRoomDetails) {
            
            userRoomDetails.users.length = userRoomDetails.users.length - 1;
            
            let userRoomDetailsIndex = this.rooms.indexOf(userRoomDetails);
            this.rooms[userRoomDetailsIndex] = userRoomDetails;

            if(userRoomDetails.users.length === 0) {
                this.rooms = this.rooms.filter(x => x.room != room);
            }
        }
        
        if(userName) {
            this.server.to(userName.split('*')[1]).emit( 'userLeft', { name: userName.split('*')[0], userCount: userRoomDetails.users.length, users: userRoomDetails.users  })
        }
    }
  
    public handleConnection(client: Socket): void {
      return console.log(`Client connected: ${client.id}`);
    }

  }