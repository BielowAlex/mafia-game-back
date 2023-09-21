import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Param,
  ParseBoolPipe,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqContext } from '../common/decorators/req-context.decorator';
import { RequestContext } from '../common/dto/request-context.dto';

@Controller('poster')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post(':movieId')
  @UseInterceptors(FileInterceptor('file'))
  async posterUpload(
    @ReqContext() ctx: RequestContext,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png|webp|heic)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('isWide', ParseBoolPipe) isWide: boolean,
  ) {
    return await this.fileService.uploadPoster(ctx, file, movieId, isWide);
  }

  @Delete()
  async posterRemove(@Body() getBody: { link: string }) {
    return await this.fileService.removePoster(getBody.link);
  }
}
