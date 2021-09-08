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
import { uploadFile } from 'src/_utility/upload.util';
import { ExtendPublishEventDto } from './dto/extend-publish-event.dto';


@Controller('event')
@ApiBearerAuth()
@ApiTags('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

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
  @UseGuards(AuthGuard())
  async create(@Body() createEventDto: CreateEventDto, @Req() req: any, @UploadedFile() eventImage: any): Promise<string> {

    let imageUrl = "";
    if (eventImage) {
      imageUrl = await uploadFile(eventImage.path);
      createEventDto.coverImage = imageUrl;
    }
    return this.eventService.create(createEventDto, req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all publish events' })
  @ApiResponse({ status: 200, description: 'Return all publish events' })
  async findAll(@Query() filterDto: FilterDto): Promise<EventRO[]> {
    return await this.eventService.findAllPublishEvents(filterDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('allevents')
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events' })
  @UseGuards(AuthGuard())
  async Get(@Query() filterDto: FilterDto): Promise<EventRO[]> {
    return await this.eventService.GetAllEvents(filterDto);
  }

  @Get('myevent')
  @ApiOperation({ summary: 'Get all my events' })
  @ApiResponse({ status: 200, description: 'Return all my events' })
  @UseGuards(AuthGuard())
  async findMyEvents(@Query() filterDto: FilterDto, @Req() req: any): Promise<EventRO[]> {
    return await this.eventService.findMyEvents(filterDto, req.user);
  }

  @Get('publicevent')
  @ApiOperation({ summary: 'Get all my events' })
  @ApiResponse({ status: 200, description: 'Return all my events' })
  async findPublicEvents(@Query() filterDto: FilterDto): Promise<EventRO[]> {
    return await this.eventService.findPublicEvents(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event' })
  @ApiResponse({ status: 200, description: 'Return event' })
  // @UseGuards(AuthGuard())
  async findOne(@Param('id') id: string): Promise<EventRO> {
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
  @UseGuards(AuthGuard())
  async update(@Param('id') id: string, @Body() request: UpdateEventDto, @Req() req: any,  @UploadedFile() eventImage: any): Promise<string> {
    let imageUrl = "";
    if (eventImage) {
      imageUrl = await uploadFile(eventImage.path);
      request.coverImage = imageUrl;
    }
       
    return await this.eventService.update(id, request, req);
  }

  @Put('publish/:id')
  @ApiOperation({ summary: 'Publish event' })
  @ApiResponse({ status: 200, description: 'Return event successfully published' })
  @UseGuards(AuthGuard())
  async publishEvent(@Param('id') id: string, @Req() req: any): Promise<string> {
    if (req.user.accountType != 'Admin') {
      throw new HttpException('Only an admin user can publish event.', HttpStatus.BAD_REQUEST)
    }
    return await this.eventService.publishEvent(id, req.user);
  }

  @Put('reject/:id')
  @ApiOperation({ summary: 'Reject event' })
  @ApiResponse({ status: 200, description: 'Return event successfully rejected' })
  @UseGuards(AuthGuard())
  async rejectEvent(@Param('id') id: string, @Body() payload: { rejectionMessage }, @Req() req: any): Promise<string> {
    if (req.user.accountType != 'Admin') {
      throw new HttpException('Only an admin user can reject event.', HttpStatus.BAD_REQUEST)
    }
    return await this.eventService.rejectEvent(id, payload, req.user);
  }


  @Post('register')
  @ApiOperation({ summary: 'Register for an Event' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @UseGuards(AuthGuard())
  async EventRegistration(@Body() eventRegistrationDtoDto: EventRegistrationDto, @Req() req: any): Promise<string> {
    return await this.eventService.addEventRegistration(eventRegistrationDtoDto, req.user);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted' })
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string) {
    return await this.eventService.remove(id);
  }

  @Put('cancel/:id')
  @ApiOperation({ summary: 'Cancel an event' })
  @ApiResponse({ status: 200, description: 'Return event successfully cancelled' })
  @UseGuards(AuthGuard())
  async cancelEvent(@Param('id') id: string, @Body() payload: { reason }, @Req() req: any): Promise<string> {
    return await this.eventService.cancelEvent(id, payload, req.user);
  }

  @Put('extend_published_event/:id')
  @ApiOperation({ summary: 'Extend published event' })
  @ApiResponse({ status: 200, description: 'Return event successfully extended' })
  @UseGuards(AuthGuard())
  async extendPublishEvent(@Param('id') id: string, @Body() request: ExtendPublishEventDto, @Req() req: any): Promise<string> {
    return await this.eventService.extendPublishEvent(id, request, req.user);
  }
}


