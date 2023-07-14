import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/footer/index.module.scss';

const FooterLogo = () => {
  return (
    <div className={styles.footer__top__item}>
      <Link
        href='/dashboard'
        passHref
        legacyBehavior>
        <a className={styles.footer__top__item__logo}>
          <Image
            src='/img/logo-footer.svg'
            alt='logo'
            width={30}
            height={30}
          />
          <span className={styles.footer__top__item__logo__text}>
            Детали для газовых котлов
          </span>
        </a>
      </Link>
    </div>
  );
};

export default FooterLogo;
