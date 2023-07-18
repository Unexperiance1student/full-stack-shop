import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock';
import { $mode } from '@/context/mode';
import styles from '@/styles/catalog/index.module.scss';
import { useStore } from 'effector-react';
import { AnimatePresence } from 'framer-motion';

const CatalogPage = () => {
  const mode = useStore($mode);
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
        </h2>
        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            <ManufacturersBlock title='Производитель котлов:' />
          </AnimatePresence>
          <AnimatePresence>
            <ManufacturersBlock title='Производитель запчастей:' />
          </AnimatePresence>
          <div className={styles.catalog__top__inner}>
            <button>Сбросить фильтр</button>
          </div>
        </div>
        <div className={styles.catalog__bottom}></div>
      </div>
    </section>
  );
};

export default CatalogPage;
