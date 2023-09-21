import { makeReq } from './axios.service';
import { ConfigService } from '@nestjs/config';
import { vkino } from '../constants/urls';

const configService = new ConfigService();

const axiosConfig = {
  auth: {
    username: configService.get('APP_MOVIE_API_LOGIN'),
    password: configService.get('APP_MOVIE_API_PASS'),
  },
};

export const VkinoService = {
  getALlCinemaInfo: () =>
    makeReq<IAllCinemaInfo>(
      `${configService.get('APP_MOVIE_API')}/${vkino.ALL_CINEMA_INFO}`,
      axiosConfig,
    ),
  getALlHalls: () =>
    makeReq<IHallResponseData>(
      `${configService.get('APP_MOVIE_API')}/${vkino.ALL_HALLS}`,
      axiosConfig,
    ),
  getCinemaInfo: () =>
    makeReq(
      `${configService.get('APP_MOVIE_API')}/${vkino.CINEMA_INFO}`,
      axiosConfig,
    ),
  getPaymentInfo: () =>
    makeReq(
      `${configService.get('APP_MOVIE_API')}/${vkino.PAYMENT_INFO}`,
      axiosConfig,
    ),
  getShowtimesInfo: () =>
    makeReq<IAllShowtimeInfo>(
      `${configService.get('APP_MOVIE_API')}/${vkino.SHOWTIMES_INFO}`,
      axiosConfig,
    ),
};
