import { Body, Controller, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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
  changePassword(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto, @GetUser() user:User){
    return this.authService.changePassword(authCredentialsDto, user);
  }
}
