import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CooperateDTO } from './dto/cooperate.dto';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDto, LoginDto } from './dto/auth-credential.dto';
import { CooperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { UserDataRO } from './interfaces/user.interface';

@ApiBearerAuth()
@ApiTags('Account')
@Controller('account')
export class AccountController {

  constructor(private readonly accountService: AccountService) { }

  @Post('/login')
  @ApiCreatedResponse({ description: 'Returns user token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto): Promise<UserRO> {
    return await this.accountService.login(loginDto);
  }

  @Post('/register')
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async register(@Body() registerDto: RegisterDto): Promise<string> {
    return await this.accountService.register(registerDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Return all user.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async findAll(): Promise<UserDataRO[]> {
    return await this.accountService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ description: 'Return user.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async findOne(@Param('id') id: string): Promise<UserDataRO> {
    return await this.accountService.findOne(id);
  }

  @Get('/getuserbyemail')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user by email' })
  @ApiOkResponse({ description: 'Return user.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async findByEmail(@Param('email') email: string): Promise<UserDataRO> {
    return await this.accountService.findByEmail(email);
  }

  @Post('/createindividualacccount')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Create individual account' })
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createIndividual(@Body() toCreate: IndividualDTO): Promise<IndividualRO> {
    return await this.accountService.createIndividual(toCreate);
  }

  @ApiOperation({ summary: 'Create cooperate account' })
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Post('/createcooperateacccount')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async createCooperate(@Body() toCreate: CooperateDTO): Promise<CooperateRO> {
    return await this.accountService.createCooperate(toCreate);
  }

  @Put('/updateindividualacccount/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'update individual account' })
  @ApiCreatedResponse({ description: 'The record has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async updateIndividual(@Param('id') id: string, @Body() toUpdate: IndividualDTO): Promise<IndividualRO> {
    return this.accountService.updateIndividual(id, toUpdate);
  }

  @Put('/updatecooperateacccount/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'update cooperate account' })
  @ApiCreatedResponse({ description: 'The record has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async updateCooperate(@Param('id') id: string, @Body() toUpdate: CooperateDTO): Promise<CooperateRO> {
    return this.accountService.updateCooperate(id, toUpdate);
  }

  // forget endpoint
  // change password
  // disabled user (admin)
  // enabled user (admin)

}
