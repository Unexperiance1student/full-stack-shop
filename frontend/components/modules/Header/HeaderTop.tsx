import CityButton from '@/components/elements/CityButton/CityButton';
import { $mode } from '@/context/mode';
import styles from '@/styles/header/index.module.scss';
import { useStore } from 'effector-react';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';

const HeaderTop = () => {
  const mode = useStore($mode);
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

  return (
    <div className={styles.header__top}>
      <div className={`container ${styles.header__top__container}`}>
        <CityButton />

        <nav className={styles.header__nav}>
          <ul className={styles.header__nav__list}>
            <li className={styles.header__nav__list__item}>
              <Link
                href='/shopping-payment'
                passHref
                legacyBehavior>
                <a className={styles.header__nav__list__item__link}>
                  Доставка и оплата
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link
                href='/about'
                passHref
                legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link} ${darkModeClass}`}>
                  О компании
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link
                href='/catalog'
                passHref
                legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link} ${darkModeClass}`}>
                  Каталог
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link
                href='/contacts'
                passHref
                legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link} ${darkModeClass}`}>
                  Контакты
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link
                href='/wholesale-buyers'
                passHref
                legacyBehavior>
                <a
                  className={`${styles.header__nav__list__item__link} ${darkModeClass}`}>
                  Оптовым покупателям
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default HeaderTop;
