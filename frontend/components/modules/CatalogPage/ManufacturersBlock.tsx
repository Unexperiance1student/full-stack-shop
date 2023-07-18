import { $mode } from '@/context/mode';
import { useStore } from 'effector-react';
import styles from '@/styles/catalog/index.module.scss';
import { motion } from 'framer-motion';
import { IManufacturersBlockProps } from '@/types/catalog';

const ManufacturersBlock = ({ title }: IManufacturersBlockProps) => {
  const mode = useStore($mode);
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${styles.manufacturers} ${darkModeClass}`}>
      <h3 className={`${styles.manufacturers__title} ${darkModeClass}`}>
        {title}
      </h3>
      <ul className={styles.manufacturers__list}>
        {[].map((item) => (
          <li
            key={item}
            className={styles.manufacturers__list__item}></li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ManufacturersBlock;
