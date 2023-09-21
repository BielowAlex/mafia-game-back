import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestContext } from '../common/dto/request-context.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '../users/entities/user.entity';
import { AuthLoginOutputDto } from './dto/auth-login-output.dto';
import { ERole } from '../common/enums/role.enum';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { AuthRefreshTokensDto } from './dto/auth-refresh-tokens.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let app: INestApplication;

  const mockAuthService = {
    validateUser: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Apply global validation pipe
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.getHttpAdapter()),
    ); // Apply global serialization
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('signIn', () => {
    it('should sign in the user', async () => {
      const requestContext: RequestContext = {
        requestID: '1',
        url: '/auth',
        ip: '::1',
      };
      const signInInput: AuthLoginDto = {
        login: 'testUser',
        password: 'testUser',
      };
      const currentUser: User = {
        id: '12321321213',
        username: 'testUser',
        password: 'testUser',
        role: ERole.ADMIN,
        email: 'test@mail.com',
      };
      const authLoginOutput: AuthLoginOutputDto = {
        accessToken: 'sadsadsadsadsa324rrsaf32',
        refreshToken:
          'sadsadsadsadsadsadsafdsafhfhdslfhdsh2h4oi32oi4y32432belj',
      };

      mockAuthService.validateUser.mockResolvedValue(currentUser);
      mockAuthService.signIn.mockResolvedValue(authLoginOutput);

      const result = await controller.signIn(requestContext, signInInput);

      expect(result).toBe(authLoginOutput);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        requestContext,
        signInInput.login,
        signInInput.password,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        requestContext,
        currentUser,
      );
    });
  });

  describe('signUp', () => {
    it('should sign up and sign in the user', async () => {
      const requestContext: RequestContext = {
        requestID: '1',
        url: '/auth',
        ip: '::1',
      };
      const signUpInput: AuthRegistrationDto = {
        role: ERole.USER,
        username: 'testUser2',
        email: 'test2@mail.com',
        password: 'testUser2',
      };
      const currentUser: User = {
        id: '12321321213',
        username: 'testUser',
        password: 'testUser',
        role: ERole.ADMIN,
        email: 'test@mail.com',
      };
      const authLoginOutput: AuthLoginOutputDto = {
        accessToken: 'sadsadsadsadsa324rrsaf32',
        refreshToken:
          'sadsadsadsadsadsadsafdsafhfhdslfhdsh2h4oi32oi4y32432belj',
      };

      mockAuthService.signUp.mockResolvedValue(currentUser);
      mockAuthService.signIn.mockResolvedValue(authLoginOutput);

      const result = await controller.signUp(requestContext, signUpInput);

      expect(result).toBe(authLoginOutput);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(
        requestContext,
        signUpInput,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        requestContext,
        currentUser,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens', async () => {
      const requestContext: RequestContext = {
        requestID: '1',
        url: '/auth',
        ip: '::1',
      };
      const refreshTokensInput: AuthRefreshTokensDto = {
        refreshToken: 'refreshToken',
      };
      const authLoginOutput: AuthLoginOutputDto = {
        accessToken: 'sadsadsadsadsa324rrsaf32',
        refreshToken:
          'sadsadsadsadsadsadsafdsafhfhdslfhdsh2h4oi32oi4y32432belj',
      };

      mockAuthService.refreshTokens.mockResolvedValue(authLoginOutput);

      const result = await controller.refreshTokens(
        requestContext,
        refreshTokensInput,
      );

      expect(result).toBe(authLoginOutput);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        requestContext,
        refreshTokensInput.refreshToken,
      );
    });
  });
});
