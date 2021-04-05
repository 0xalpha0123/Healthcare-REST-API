import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards, UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthorizedUser } from '../common/decorators/getAuthorizedUser.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/verify-email/:verificationToken')
  verifyEmail(@Param() params): Promise<void> {
    return this.authService.verifyEmail(params.verificationToken);
  }

  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Patch('/change-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  changePassword(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @GetAuthorizedUser() user: User,
  ) {
    return this.authService.changePassword(authCredentialsDto, user);
  }
}
