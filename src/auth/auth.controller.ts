import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { RequestContext } from '../common/dto/request-context.dto';
import { ReqContext } from '../common/decorators/req-context.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';
import { AuthLoginOutputDto } from './dto/auth-login-output.dto';
import { AuthRefreshTokensDto } from './dto/auth-refresh-tokens.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRegistrationDto } from './dto/auth-registration.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ description: 'Request for login in admin-dashboard' })
  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async signIn(
    @ReqContext() ctx: RequestContext,
    @Body() signInInput: AuthLoginDto,
  ): Promise<AuthLoginOutputDto> {
    const currentUser: User = await this.authService.validateUser(
      ctx,
      signInInput.login,
      signInInput.password,
    );
    return await this.authService.signIn(ctx, currentUser);
  }

  @ApiResponse({ description: 'Request for login in admin-dashboard' })
  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(
    @ReqContext() ctx: RequestContext,
    @Body() signUpInput: AuthRegistrationDto,
  ): Promise<AuthLoginOutputDto> {
    return await this.authService.signUp(ctx, signUpInput);
  }

  @ApiResponse({ description: 'Request for refresh your tokens' })
  @Post('refresh-tokens')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshTokens(
    @ReqContext() ctx,
    @Body() refreshTokensBody: AuthRefreshTokensDto,
  ): Promise<AuthLoginOutputDto> {
    return await this.authService.refreshTokens(
      ctx,
      refreshTokensBody.refreshToken,
    );
  }

  @ApiResponse({ description: 'Request for check is token valid' })
  @Get('check-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  isTokenValid() {
    return {
      isValid: true,
    };
  }

  @ApiResponse({ description: 'Request for log out' })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async logOut(
    @ReqContext() ctx: RequestContext,
    @ExtractUserId() userId: string,
  ) {
    return await this.authService.logout(ctx, userId);
  }
}
