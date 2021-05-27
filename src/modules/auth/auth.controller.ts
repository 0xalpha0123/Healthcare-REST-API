import {
  Body,
  Controller,
  Get, HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, VerificationTokenParamDto } from './auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthorizedUser } from '../../common/decorators/getAuthorizedUser.decorator';
import { User } from './user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The user has successfully sign up.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with given email already exist.',
  })
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/verify-email/:verificationToken')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The email has been successfully verified.',
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect verification token.',
  })
  verifyEmail(@Param() params: VerificationTokenParamDto): Promise<void> {
    return this.authService.verifyEmail(params.verificationToken);
  }

  @Post('/sign-in')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The user has successfully sign in.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or inactive account.',
  })
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Patch('/change-password')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The password was successfully changed',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  changePassword(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @GetAuthorizedUser() user: User,
  ) {
    return this.authService.changePassword(authCredentialsDto, user);
  }

  @UseGuards(AuthGuard())
  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User is authorized',
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized',
  })
  getIsAuth() {
    return;
  }
}
