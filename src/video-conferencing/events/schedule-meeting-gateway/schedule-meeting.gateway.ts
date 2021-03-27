import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { Server, Socket } from 'socket.io';
import { ScheduleMeetingEntity } from 'src/video-conferencing/schedule-meetings/entities/schedule-meeting.entity';
import { ScheduleMeetingRepository } from 'src/video-conferencing/schedule-meetings/schedule-meeting.repository';
import { Connection } from 'typeorm';
  
  //Websocket gateway for scheduled video conferencing
  @WebSocketGateway({namespace: '/schedulemeetinggateway'})
  export class ScheduleMeetingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private  scheduleMeetingRepo: ScheduleMeetingRepository
    constructor(
      private readonly connection: Connection
  ) {
      this.scheduleMeetingRepo = this.connection.getCustomRepository(ScheduleMeetingRepository);
    
  }

    @WebSocketServer() server: Server;
    meetings: Array<any> = [];

    @SubscribeMessage('startMeeting')
    public async handleStartMeeting(client: Socket, data: any) {

      if(!data.id || !data.meetingId || !data.name || !data.socketId) {
        throw new WsException("Please make sure id, meetingId, name and socketId is provided");
      }

      try {

          const meeting = await this.scheduleMeetingRepo.findOne(data.id);

          if(!meeting) {
              throw new WsException(`The meeting with ID ${data.id} cannot be found`);
          }

          // if(meeting.meetingStarted) {
          //   throw new WsException(`Meeting already started`);
          // } else if (meeting.meetingEnded) {
          //     throw new WsException(`Meeting already ended`);
          // }
          
          meeting.meetingStarted = true;
          const updated = plainToClass(ScheduleMeetingEntity, meeting);

      
          const saved = await this.scheduleMeetingRepo.save(updated);
          if(saved) {
               //create a room
            client.join( data.meetingId );
            client.join( data.socketId );
            //create a data store for the current room and its users
            let meetingObj = {
                meetingId: data.meetingID,
                socketId: data.socketId,
                name: data.name
            }

            this.meetings.push(meetingObj);

            //this.server.to(data.socketId).emit('socketResponse', { socketResponse: {participantCount: this.meetings.length, name: this.meetings[this.meetings.length - 1].name}});
            this.server.to(data.socketId).emit('count', { count: this.meetings.length, users: this.meetings, isNew: data.isNewMeeting });
          }

      } catch (error) {
        throw new WsException(`Unable to start meeting - Error: ${error.message}`);
      }
 
    }

    @SubscribeMessage('joinMeeting')
    public async handleJoinMeeting(client: Socket, data: any) {
        
        if(!data.id || !data.meetingId || !data.name || !data.socketId) {
            throw new WsException("Please make sure id, meetingId, name and socketId is provided");
        }
        
        try {
          const meeting = await this.scheduleMeetingRepo.findOne(data.id);

          if(!meeting) {
              throw new WsException(`The meeting with ID ${data.id} cannot be found`);
          }
  
          const today = new Date();
  
          if(today > new Date(meeting.startDate)) {
            throw new WsException(`You cannot join a meeting scheduled for a previous day`);
          }

          if(!meeting.meetingStarted) {
            throw new WsException(`The meeting has not started.`);
          } else if (meeting.meetingEnded) {
            throw new WsException(`The meeting has ended.`);
          }
  
          // const obj = {
          //   durationInHours: meeting.durationInHours,
          //   durationInMinutes: meeting.durationInMinutes,
          //   startTime: meeting.startTime,
          //   today
          // }
  
          // if(!this.MeetingValid(obj)) {
          //   throw new WsException('This meeting has ended or is no longer valid');
          // }
  
          //if user wants to join with the passcode, make sure he/she has the correct passcode
          if(data.passcode) {
            if (data.passcode != meeting.passcode) {
              throw new WsException(`The passcode for the meeting is incorrect`);
            } 
          }
  
          //join a room
          client.join( data.meetingId );
          client.join( data.socketId );
  
          let meetingObj = {
            meetingId: data.meetingID,
            socketId: data.socketId,
            name: data.name
          }
  
          this.meetings.push(meetingObj);
  
  
          const meetings = this.meetings.filter(x => x.meetingId === data.meetingId);
          //const userThatJoinedInfo = this.meetings.find(x => x.socketId === data.socketId);
  
          //Inform other members in the room of new user's arrival
          if ( client.adapter.rooms[data.meetingId].length > 1 ) {
              client.to( data.meetingId ).emit( 'new user', { socketId: data.socketId, user: data.name, count: meetings.length, users: meetings} );
              this.server.to( data.socketId ).emit( 'count', { count: meetings.length, users: meetings, isNew: data.isNewMeeting } );
          }
        } catch (error) {
          throw new WsException(`Unable to join meeting - Error: ${error.message}`);
        }
        
    }

    @SubscribeMessage('newUserStart')
    public handleNewUserStart(client: Socket, data: any): void {

        client.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    }

    @SubscribeMessage('sdp')
    public handleSDP(client: Socket, data: any): void  {
        client.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    }

    @SubscribeMessage('ice candidates')
    public handleIceCandidates(client: Socket, data: any): void  {
        client.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    }


    @SubscribeMessage('chat')
    public handleOnChat(client: Socket, data: any): void {
      client.to( data.meetingId ).emit( 'chat', { sender: data.sender, msg: data.msg } );
    }

    @SubscribeMessage('endMeeting')
    public async handleEndMeeting(client: Socket, data: any) {

        const meeting = await this.scheduleMeetingRepo.findOne(data.id);
        if(!meeting) {
            throw new WsException(`Cannot end a meeting that does not exist.`);
        }

        if(!meeting.meetingStarted) {
            throw new WsException(`Cannot end a meeting that has not started yet`);
        }

        meeting.meetingEnded = true;

        const updated = plainToClass(ScheduleMeetingEntity, meeting);
        
        try {
          const saved = await this.scheduleMeetingRepo.save(updated);
          if(saved) {
            await this.scheduleMeetingRepo.delete({ id: meeting.id });
            client.to( data.meetingId ).emit( 'meetingEnded', { message: "The meeting has ended" } );
          }
        
        } catch (error) {
          throw new WsException(`Unable to end meeting - Error: ${error.message}`);
        }
      
    }

    /// watchers
    public afterInit(server: Server): void {
      return console.log("init");
    }
  
    public handleDisconnect(client: Socket): void {
      client.id = client.id.split('#')[1];
      
      const userThatLeft = this.meetings.find(x => x.socketId === client.id);
      
      if(userThatLeft) {
        this.meetings = this.meetings.filter(x => x.meetingId != userThatLeft.meetingId);

        const usersRemaining = this.meetings.filter(x => x.meetingId === userThatLeft.meetingId);   
  
        client.to(userThatLeft.meetingId).emit( 'userLeft', { name: userThatLeft.name, count:usersRemaining.length, users: usersRemaining  })
      }
    }
  
    public handleConnection(client: Socket): void {
      return console.log(`Client connected: ${client.id}`);
    }

    private MeetingValid(data): boolean {
      let duration;

      if(data.durationInHours > 0) {
        duration = data.durationInHours * 60
      }

      if(data.durationInMinutes > 0) {
          duration += data.durationInMinutes;
      }

      const todayTime: any = `${data.today.getHours()}:${data.today.getMinutes()}`;

      const splittedStartTime = data.startTime.toString().split(':');
      const startTime: any = `${splittedStartTime[0]}.${splittedStartTime[1]}`;
      
      let timeDifference = todayTime - startTime;

      if(Math.abs(timeDifference) >= duration) {
        return false;
      }

      return true;
      
    }

  }