'use client';
import styles from '@/styles/header/index.module.scss';
import HeaderTop from './HeaderTop';
const Header = () => {
  return (
    <header className={styles.header}>
      <HeaderTop />
    </header>
  );
};

export default Header;
