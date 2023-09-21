import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { RequestContext } from '../common/dto/request-context.dto';

@Injectable()
export class FileService {
  private s3Client = new S3Client({
    region: this.configService.get('AWS_S3_REGION'),
  });
  constructor(private configService: ConfigService) {}

  async uploadPoster(
    ctx: RequestContext,
    file: Express.Multer.File,
    movieId: number,
    isWide: boolean,
  ) {
    try {
      // await this.s3Client.send(
      //   new PutObjectCommand({
      //     Bucket: this.configService.get('AWS_S3_BUCKET'),
      //     Key: `posters/${movieId}/${timestamp}-poster${isWide ? 'Wide' : ''}`,
      //     Body: file.buffer,
      //   }),
      // );
    } catch (e) {
      throw new NotFoundException(`${e}`);
    }
  }

  async removePoster(link: string) {
    try {
      // return await this.s3Client.send(
      //   new DeleteObjectCommand({
      //     Bucket: this.configService.get('AWS_S3_BUCKET'),
      //     Key: `posters/${filePath}/${fileName}`,
      //   }),
      // );
    } catch (e) {
      throw new BadGatewayException(e);
    }
  }
}
