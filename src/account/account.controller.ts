import { Controller, Get, Post, Body, Put, Param, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CooperateDTO } from './dto/cooperate.dto';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDTO, LoginDTO, LockUserDTO } from './dto/credential.dto';
import { CooperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { UserDataRO } from './interfaces/user.interface';

@ApiBearerAuth()
@ApiTags('Account')
@Controller('account')
export class AccountController {

  constructor(private readonly accountService: AccountService) { }

  @Post('/login')
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 201, description: 'Return user credential'})
  async login(@Body() loginDto: LoginDTO): Promise<UserRO> {
    return await this.accountService.login(loginDto);
  }

  @Post('/register')
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 201, description: 'The record has been successfully created'})
  async register(@Body() registerDto: RegisterDTO): Promise<string> {
    return await this.accountService.register(registerDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all user'})
  async findAll(): Promise<UserDataRO[]> {
    return await this.accountService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 200, description: 'Return user'})
  async findOne(@Param('id') id: string): Promise<UserDataRO> {
    return await this.accountService.findOne(id);
  }

  @Get('/getbyemail/:email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 200, description: 'Return user'})
  async findByEmail(@Param('email') email: string): Promise<UserDataRO> {
    return await this.accountService.findByEmail(email);
  }

  @Put('/individual/:email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'update individual account' })
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 201, description: 'The record has been successfully updated' })
  async individual(@Param('email') email: string, @Body() toUpdate: IndividualDTO): Promise<IndividualRO> {
    return this.accountService.updateIndividual(email, toUpdate);
  }

  @Put('/cooperate/:email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'update cooperate account' })
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 201, description: 'The record has been successfully updated' })
  async cooperate(@Param('email') email: string, @Body() toUpdate: CooperateDTO): Promise<CooperateRO> {
    return this.accountService.updateCorperate(email, toUpdate);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Enable and disable user endpoint' })
  @ApiResponse({ status: 404, description: 'Not found'})
  @ApiResponse({ status: 204, description: 'No content'})
  async lockAndUnlockUser(@Body() lockUserDto: LockUserDTO): Promise<UserDataRO> {
    return await this.accountService.lockAndUnlockUser(lockUserDto);
  }

  // forget endpoint

}
