interface IHall {
  id: number;
  sectorId: number;
  ratio_x?: string;
  name: string;
  nameAlt: string;
}

interface ITheater {
  alias: string;
  group: string;
  type: string;
  name: string;
  nameAlt: string;
  juridicalPerson: string;
  juridicalPersonAlt: string;
  phone: string;
  website: string;
  email: string;
  logo: string;
  halls: {
    hall: IHall[];
  };
}

interface IHallResponseData {
  request: string;
  processingTime: string;
  code: number;
  message: string;
  created: string;
  gmt: string;
  version: string;
  theater: ITheater;
  copyright: string;
}

interface ICity {
  id: number;
  alias: string;
  latitude: number;
  longitude: number;
  name: string;
  nameAlt: string;
}

interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
  addressAlt: string;
  addressShort: string;
  addressShortAlt: string;
  city: ICity;
}

interface IShow {
  id: number;
  alias: string;
  type: string;
  catalog: string | null;
  catalogId: number | null;
  name: string;
  nameAlt: string;
  nameOriginal: string;
  runningTime: number;
  releaseDate: string;
  genre: string;
  genreAlt: string;
  language: string;
  country: string;
  countryAlt: string;
  ageLimit: string;
  year: number;
  posterUrl: string;
  youtubeVideoId: string;
  imdbId: string | null;
  trailerUrl: string | null;
  isPremiere: 'y' | 'n';
  gallery: {
    poster: {
      url: string;
      modified: string;
    };
    posterWide: {
      url: string;
      modified: string;
    };
  };
  plot: string;
  plotAlt: string;
  description: string;
  descriptionAlt: string;
  starring: string;
  starringAlt: string;
  writer: string;
  writerAlt: string;
  director: string;
  directorAlt: string;
  dates: {
    date: string[];
  };
  formats: {
    format: string[];
  };
}

interface IPaymentCapability {
  charge?: 'y' | 'n';
  'refund-ex'?: 'y' | 'n';
  status?: 'y' | 'n';
  'google-pay'?: 'y' | 'n';
  'apple-pay'?: 'y' | 'n';
  token?: 'y' | 'n';
  refund?: 'y' | 'n';
}

interface IPaymentMethod {
  alias: string;
  name: string;
  nameAlt: string;
  description: string;
  provider: string;
  capabilities: IPaymentCapability;
}

interface ILoyaltyProgram {
  cardFormat: string;
}

interface IServices {
  booking: 'y' | 'n';
  purchase: 'y' | 'n';
  ticketScanner: 'y' | 'n';
  loyaltyProgram: ILoyaltyProgram;
}

interface IAllTheaterInfo {
  alias: string;
  group: string;
  type: string;
  name: string;
  nameAlt: string;
  juridicalPerson: string;
  juridicalPersonAlt: string;
  phone: string;
  website: string;
  email: string;
  logo: string;
  location: ILocation;
  halls: {
    hall: IHall[];
  };
  payments: {
    currency: {
      caption: string;
      code: string;
    };
    googlePay: IPaymentMethod;
    applePay: IPaymentMethod;
    payee: IPaymentMethod[];
  };
  services: IServices;
}

interface IShowtime {
  id: number;
  showId: number;
  theaterAlias: string;
  date: string;
  unixtime: number;
  hallId: number;
  sectors: string;
  technology: string;
  technologyCaption: string;
  format: string;
  formatText: string;
  is3d: string;
  purchase: string;
  booking: string;
  allocatedSeating: string;
  openSeating: string;
  canceled: string;
  priceList: string;
  saleCloses: string;
}

interface IShowtimesData {
  showtime: IShowtime[];
}

interface IAllShowtimeInfo {
  request: string;
  processingTime: string;
  code: number;
  message: string;
  created: string;
  gmt: string;
  version: string;
  showstimes: IShowtimesData;
}

interface IAllCinemaInfo {
  request: string;
  processingTime: string;
  code: number;
  message: string;
  created: string;
  gmt: string;
  version: string;
  theater: IAllTheaterInfo;
  shows: {
    show: IShow[];
  };
  showsDates: {
    date: string[];
  };
  showsFormats: {
    format: string[];
  };
  ['shows-soon']: {
    show: any[];
  };
  showstimes: IShowtimesData;
}
