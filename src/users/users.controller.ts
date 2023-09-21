import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReqContext } from '../common/decorators/req-context.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from '../common/pipes/uuid-validation.pipe';
import { ExtractUserId } from '../common/decorators/extract-user-id.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // commented but may be needed in the future
  // @Post()
  // async create(@ReqContext() ctx, @Body() createUserDto: CreateUserDto) {
  //   return await this.usersService.create(ctx, createUserDto);
  // }
  @ApiResponse({ description: 'Get all users.' })
  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll(@ReqContext() ctx) {
    return await this.usersService.findAll(ctx);
  }

  @ApiResponse({ description: 'Get user by id.' })
  @Get('/current')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  getByID(@ReqContext() ctx, @ExtractUserId() userId: string) {
    return this.usersService.findById(ctx, userId);
  }

  @ApiResponse({ description: 'Get user by id and update.' })
  @Patch()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @ReqContext() ctx,
    @ExtractUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(ctx, userId, updateUserDto);
  }

  @ApiResponse({ description: 'Get user by id and remove.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  remove(@ReqContext() ctx, @Param('id', UUIDValidationPipe) id: string) {
    return this.usersService.remove(ctx, id);
  }
}
