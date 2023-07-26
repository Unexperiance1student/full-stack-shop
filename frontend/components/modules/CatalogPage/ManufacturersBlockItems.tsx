import { $mode } from '@/context/mode';
import { useStore } from 'effector-react';
import styles from '@/styles/catalog/index.module.scss';
import { motion } from 'framer-motion';
import {
  IFilterCheckboxItem,
  IManufacturersBlockItemProps,
  IManufacturersBlockProps,
} from '@/types/catalog';
import DeleteSvg from '@/components/elements/DeleteSvg/DeleteSvg';

const ManufacturersBlockItems = ({
  item,
  event,
}: IManufacturersBlockItemProps) => {
  const mode = useStore($mode);
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

  const removeFilter = () =>
    event({ checked: !item.checked, id: item.id } as IFilterCheckboxItem);

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${styles.manufacturers__list__item} ${darkModeClass}`}>
      <span className={styles.manufacturers__list__item__text}>
        {item.title}
      </span>
      <button
        className={styles.manufacturers__list__item__btn}
        onClick={removeFilter}>
        <span>
          <DeleteSvg />
        </span>
      </button>
    </motion.li>
  );
};

export default ManufacturersBlockItems;
