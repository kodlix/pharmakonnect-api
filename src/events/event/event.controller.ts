import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseInterceptors, ClassSerializerInterceptor, Query, Patch, UseGuards, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRO } from './interfaces/event.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'src/_common/filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/_utility/fileupload.util';
import { diskStorage } from 'multer';
import { EventRegistrationDto } from './dto/event-registration.dto';


@Controller('event')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

   @UseInterceptors(
     FileInterceptor('coverImage', {
       storage: diskStorage({
         destination: './uploads',
         filename: editFileName,
       }),
       fileFilter: imageFileFilter,
     }),
   )
  @Post()
  @ApiOperation({ summary: 'Save Event' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  create(@UploadedFile() file, @Body() createEventDto: CreateEventDto, @Req() req: any): Promise<string> {
    return this.eventService.create(file ? file.filename : "" , createEventDto, req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all publish events' })
  @ApiResponse({ status: 200, description: 'Return all publish events' })
  async findAll(@Query() filterDto: FilterDto) : Promise<EventRO[]>{
    return await this.eventService.findAllPublishEvents(filterDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('allevents')
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events' })
  async Get(@Query() filterDto: FilterDto) : Promise<EventRO[]>{
    return await this.eventService.GetAllEvents(filterDto);
  }

  @Get('myevent')
  @ApiOperation({ summary: 'Get all my events' })
  @ApiResponse({ status: 200, description: 'Return all my events' })
  async findMyEvents(@Query() filterDto: FilterDto,  @Req() req: any ) : Promise<EventRO[]>{
    return await this.eventService.findMyEvents(filterDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event' })
  @ApiResponse({ status: 200, description: 'Return event' })
  async findOne(@Param('id') id: string) : Promise<EventRO> {
    return await this.eventService.findOne(id);
  }

  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Return event successfully updated' })
  async update(@Param('id') id: string, @UploadedFile() file, @Body() request: UpdateEventDto, @Req() req: any): Promise<string> {
    return await this.eventService.update(id, file ? file.filename : "" , request, req);
  }

  @Put('publish/:id')
  @ApiOperation({ summary: 'Publish event' })
  @ApiResponse({ status: 200, description: 'Return event successfully published' })
  async publishEvent(@Param('id') id: string, @Req() req: any) : Promise<string> {
    if(req.user.accountType != 'Admin') {
      throw new HttpException('Only an admin user can publish event.', HttpStatus.BAD_REQUEST)
    }
    return await this.eventService.publishEvent(id, req.user);
  }

  @Put('reject/:id')
  @ApiOperation({ summary: 'Reject event' })
  @ApiResponse({ status: 200, description: 'Return event successfully rejected' })
  async rejectEvent(@Param('id') id: string, @Body() payload: { rejectionMessage}, @Req() req: any) : Promise<string> {
    if(req.user.accountType != 'Admin') {
      throw new HttpException('Only an admin user can reject event.', HttpStatus.BAD_REQUEST)
    }
    return await this.eventService.rejectEvent(id, payload, req.user);
  }


  @Post('register')
  @ApiOperation({ summary: 'Register for an Event' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async EventRegistration(@Body() eventRegistrationDtoDto: EventRegistrationDto, @Req() req: any): Promise<string> {
    return await this.eventService.addEventRegistration(eventRegistrationDtoDto, req.user);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted' })
  async remove(@Param('id') id: string) {
    return await this.eventService.remove(id);
  }
}


