import { $mode } from '@/context/mode';
import { useStore } from 'effector-react';
import styles from '@/styles/catalog/index.module.scss';
import spinnerStyles from '@/styles/spinner/index.module.scss';
import {
  $boilerManufacturers,
  $partsManufacturers,
  setBoilerManufacturers,
  setPartsManufacturers,
  updateBoilerManufacturer,
  updatePartsManufacturer,
} from '@/context/boilerParts';
import FilterManufacturerAccordion from './FilterManufacturerAccordion';
import Accordion from '@/components/elements/Accordion/Accordion';
import PriceRange from './PriceRange';
import { ICatalogFilterDesktopProps } from '@/types/catalog';

const CatalogFiltersDekstop = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  spinner,
}: ICatalogFilterDesktopProps) => {
  const mode = useStore($mode);
  const boilerManufacturers = useStore($boilerManufacturers);
  const partsManufacturers = useStore($partsManufacturers);
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';

  return (
    <div className={`${styles.catalog__bottom__filters} ${darkModeClass}`}>
      <h3
        className={`${darkModeClass} ${styles.catalog__bottom__filters__title}`}>
        Фильтры
      </h3>
      <div className={styles.filters__boiler_manufacturers}>
        <FilterManufacturerAccordion
          manufacturersList={boilerManufacturers}
          title='Производитель котлов'
          updateManufacturer={updateBoilerManufacturer}
          setManufacturer={setBoilerManufacturers}
        />
      </div>
      <div className={styles.filters__price}>
        <Accordion
          title='Цена'
          titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
          arrowOpenClass={styles.open}>
          <div className={styles.filters__manufacturer__inner}>
            <PriceRange
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
            />
            <div style={{ height: 24 }} />
          </div>
        </Accordion>
      </div>
      <div className={styles.filters__boiler_manufacturers}>
        <FilterManufacturerAccordion
          manufacturersList={partsManufacturers}
          title='Производитель запчастей'
          updateManufacturer={updatePartsManufacturer}
          setManufacturer={setPartsManufacturers}
        />
      </div>
      <div className={styles.filters__actions}>
        <button
          className={styles.filters__actions__show}
          disabled={spinner || resetFilterBtnDisabled}>
          {spinner ? (
            <span
              className={spinnerStyles.spinner}
              style={{ top: 6, left: '47%' }}
            />
          ) : (
            'Показать'
          )}
        </button>
        <button
          className={styles.filters__actions__reset}
          disabled={resetFilterBtnDisabled}>
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default CatalogFiltersDekstop;
