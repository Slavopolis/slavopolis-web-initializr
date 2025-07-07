import React from 'react';
import { Carousel } from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import bannerAi from '@/assets/login/banner_ai.png';
import bannerBase from '@/assets/login/banner_base.png';
import bannerNote from '@/assets/login/banner_note.png';

export default function LoginBanner() {
  const t = useLocale(locale);
  const data = [
    {
      slogan: t['login.banner.slogan1'],
      subSlogan: t['login.banner.subSlogan1'],
      image: bannerAi,
    },
    {
      slogan: t['login.banner.slogan2'],
      subSlogan: t['login.banner.subSlogan2'],
      image: bannerBase,
    },
    {
      slogan: t['login.banner.slogan3'],
      subSlogan: t['login.banner.subSlogan3'],
      image: bannerNote,
    },
  ];
  return (
    <Carousel
      className={styles.carousel}
      animation="slide"
      autoPlay={true}
      autoPlaySpeed={5000}
      showArrow="always"
      indicatorType="dot"
      indicatorPosition="bottom"
      moveSpeed={800}
      timingFunc="cubic-bezier(0.34, 0.69, 0.1, 1)"
    >
      {data.map((item, index) => (
        <div key={`${index}`}>
          <div className={styles['carousel-item']}>
            <div className={styles['carousel-title']}>{item.slogan}</div>
            <div className={styles['carousel-sub-title']}>{item.subSlogan}</div>
            <img
              alt="banner-image"
              className={styles['carousel-image']}
              src={item.image}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
