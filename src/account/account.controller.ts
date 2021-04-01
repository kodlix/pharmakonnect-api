import { Controller, Get, Post, Body, Put, Param, UseGuards, Patch, Query, UseInterceptors, HttpStatus, UploadedFile, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CorperateDTO } from './dto/cooperate.dto';
import { IndividualDTO } from './dto/individual.dto';
import { RegisterDTO, LoginDTO, LockUserDTO, ResetPasswordDto, ChangePasswordDto } from './dto/credential.dto';
import { CorperateRO, IndividualRO, UserRO } from './interfaces/account.interface';
import { OrganizationRO, UserDataRO } from './interfaces/user.interface';
import { FilterDto } from 'src/_common/filter.dto';
import { editFileName, imageFileFilter } from 'src/_utility/fileupload.util';

@ApiTags('account')
@Controller('account')
export class AccountController {

  constructor(private readonly accountService: AccountService) { }

  @Post('/login')
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 201, description: 'Return user credential' })
  async login(@Body() loginDto: LoginDTO): Promise<UserRO> {
    return await this.accountService.login(loginDto);
  }

  @Post('/register')
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created' })
  async register(@Body() registerDto: RegisterDTO): Promise<string> {
    let result = await this.accountService.register(registerDto);
    return result;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all user' })
  async findAll(@Query() filterDto: FilterDto): Promise<UserDataRO[]> {
    return await this.accountService.findAll(filterDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return user' })
  async findOne(@Param('id') id: string): Promise<UserDataRO> {
    return await this.accountService.findOne(id);
  }

  @Get('/getbyemail/:email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Return user' })
  async findByEmail(@Param('email') email: string): Promise<UserDataRO> {
    return await this.accountService.findByEmail(email);
  }

  @Put('/individual/:email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'update individual account' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 201, description: 'The record has been successfully updated' })
  async individual(@Param('email') email: string, @Body() toUpdate: IndividualDTO): Promise<IndividualRO> {
    return this.accountService.updateIndividual(email, toUpdate);
  }

  @Put('/cooperate/:email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'update cooperate account' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 201, description: 'The record has been successfully updated' })
  async cooperate(@Param('email') email: string, @Body() toUpdate: CorperateDTO): Promise<CorperateRO> {
    return this.accountService.updateCorperate(email, toUpdate);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Enable and disable user endpoint' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 204, description: 'No content' })
  async lockAndUnlockUser(@Body() lockUserDto: LockUserDTO): Promise<UserDataRO> {
    return await this.accountService.lockAndUnlockUser(lockUserDto);
  }

  @Get('/corporate/organizations')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({ status: 200, description: 'Return all organizations' })
  async findOrg(): Promise<OrganizationRO[]> {
    return await this.accountService.findOrg();
  }

  // upload single file
  @Put('/uploads')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file, @Req() req) {
    if (!file) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'no file to upload',
        data: file,
      };
    }
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };

    await this.accountService.updateProfileImage(file.filename, req.user.id);

    return {
      status: HttpStatus.OK,
      message: 'Image uploaded successfully!',
      data: response,
    };
  }

  @Get('/uploads/:file')
  getImage(@Param('file') image, @Res() res) {
    const response = res.sendFile(image, { root: './uploads' });
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }

  @Get('/verify/:token')
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  public async verifyEmail(@Param() params): Promise<string> {
    return await this.accountService.verifyEmail(params.token);
  }

  @Get('/resend-verification/:email')
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  public async sendEmailVerification(@Param() params): Promise<string> {
    if (await this.accountService.createEmailToken(params.email)) {
      if (await this.accountService.sendEmailVerification(params.email)) {
        return "Verification email has been send kindly check your mail";
      }
    }
  }

  @Get('/forgot-password/:email')
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  public async sendEmailForgotPassword(@Param() params): Promise<string> {
    return await this.accountService.sendEmailForgotPassword(params.email);
  }

  @Post('/reset-password')
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  public async setNewPassord(@Body() resetDto: ResetPasswordDto): Promise<string> {
    return await this.accountService.setNewPassord(resetDto);
  }

  @Post('/change-password')
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  public async changePassord(@Body() changeDto: ChangePasswordDto): Promise<string> {
    return await this.accountService.changedPassword(changeDto);
  }

}
