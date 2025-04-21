declare module 'swiper/react' {
  import { FC } from 'react';
  import { SwiperOptions } from 'swiper/types';

  export const Swiper: FC<SwiperOptions & { children: React.ReactNode }>;
  export const SwiperSlide: FC<{ children: React.ReactNode }>;
}

declare module 'swiper/modules' {
  export const Navigation: any;
  export const Pagination: any;
  export const Autoplay: any;
}

declare module 'swiper/css' {}
declare module 'swiper/css/navigation' {}
declare module 'swiper/css/pagination' {} 