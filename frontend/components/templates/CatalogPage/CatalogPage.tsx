import { getBoilerPartsFx } from '@/api/boilerParts';
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem';
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect';
import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock';
import {
  $boilerManufacturers,
  $boilerParts,
  $filteredBoilerParts,
  $partsManufacturers,
  setBoilerManufacturers,
  setBoilerParts,
  setPartsManufacturers,
  updateBoilerManufacturer,
  updatePartsManufacturer,
} from '@/context/boilerParts';
import { $mode } from '@/context/mode';
import styles from '@/styles/catalog/index.module.scss';
import skeletonStyles from '@/styles/skeleton/index.module.scss';
import { IBoilerParts } from '@/types/boilerpars';
import { IQueryParams } from '@/types/catalog';
import { queryString } from '@/utils/common';
import { useStore } from 'effector-react';
import { AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import CatalogFilters from '../../modules/CatalogPage/CatalogFilters';
import { usePopup } from '@/hooks/usePopup';
import { checkQueryParams } from '@/utils/catalog';
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg';

const CatalogPage = ({ query }: { query: IQueryParams | any }) => {
  const pathname = usePathname();
  const router = useRouter();
  const mode = useStore($mode);
  const boilerManufacturers = useStore($boilerManufacturers);
  const partsManufacturers = useStore($partsManufacturers);
  const filterBoilerParts = useStore($filteredBoilerParts);
  const boilerParts = useStore($boilerParts);
  const [isFilterInQuery, setIsFilterInQuery] = useState(false);
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false);
  const [priceRange, setPriceRange] = useState([1000, 9000]);
  const [spinner, setSpinner] = useState(false);
  const isValidOffset =
    query.offset && !isNaN(+query.offset) && +query.offset > 0;
  const [currentPage, setCurrentPage] = useState(
    isValidOffset ? +query.offset - 1 : 0
  );
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';
  const pagesCount = Math.ceil(boilerParts.count / 20);
  const isAnyBoilerManufacturerChecked = boilerManufacturers.some(
    (item) => item.checked
  );
  const isAnyPartsManufacturerChecked = partsManufacturers.some(
    (item) => item.checked
  );
  const resetFilterBtnDisabled = !(
    isPriceRangeChanged ||
    isAnyPartsManufacturerChecked ||
    isAnyBoilerManufacturerChecked
  );

  const { toggleOpen, open, closePopup } = usePopup();

  useEffect(() => {
    loadBoilerParts();
  }, [filterBoilerParts, isFilterInQuery]);

  const loadBoilerParts = async () => {
    try {
      setSpinner(true);
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0');

      if (!isValidOffset) {
        query.offset = '1';
        const queryStringParams = queryString(query);

        router.replace(`${pathname}?${queryStringParams}`);

        resetPagination(data);
        return;
      }

      if (isValidOffset) {
        if (+query.offset > Math.ceil(data.count / 20)) {
          query.offset = '1';
          const queryStringParams = queryString(query);

          router.push(`${pathname}?${queryStringParams}`, { shallow: true });

          setCurrentPage(0);
          setBoilerParts(isFilterInQuery ? filterBoilerParts : data);
          return;
        }

        const offset = +query.offset - 1;
        const result = await getBoilerPartsFx(
          `/boiler-parts?limit=20&offset=${offset}`
        );

        setCurrentPage(offset);
        setBoilerParts(isFilterInQuery ? filterBoilerParts : result);
        return;
      }

      setCurrentPage(0);
      setBoilerParts(isFilterInQuery ? filterBoilerParts : data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setTimeout(() => setSpinner(false), 1000);
    }
  };

  const resetPagination = (data: IBoilerParts) => {
    setCurrentPage(0);
    setBoilerParts(data);
  };

  const handlePageChange = async ({ selected }: { selected: number }) => {
    try {
      setSpinner(true);
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0');

      if (selected > pagesCount) {
        resetPagination(isFilterInQuery ? filterBoilerParts : data);
        return;
      }

      if (isValidOffset && +query.offset > Math.ceil(data.count / 2)) {
        resetPagination(isFilterInQuery ? filterBoilerParts : data);
        return;
      }

      const { isValidBoilerQuery, isValidPartsQuery, isValidPriceQuery } =
        checkQueryParams(query);

      const result = await getBoilerPartsFx(
        `/boiler-parts?limit=20&offset=${selected}${
          isFilterInQuery && isValidBoilerQuery ? `&boiler=${query.boiler}` : ''
        }${isFilterInQuery && isValidPartsQuery ? `&parts=${query.parts}` : ''}
        ${
          isFilterInQuery && isValidPriceQuery
            ? `&priceFrom=${query.priceFrom}&priceTo=${query.priceTo}`
            : ''
        }`
      );

      query.offset = selected + 1;
      const queryStringParams = queryString(query);

      router.push(`${pathname}?${queryStringParams}`, { shallow: true });
      setCurrentPage(selected);
      setBoilerParts(result);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setTimeout(() => setSpinner(false), 1000);
    }
  };

  const resetFilters = async () => {
    try {
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0');

      delete query.boiler;
      delete query.parts;
      delete query.priceTo;
      delete query.priceFrom;
      query.first = 'cheap';

      const queryStringParams = queryString(query);
      router.push(`${pathname}?${queryStringParams}`, { shallow: true });

      setBoilerManufacturers(
        boilerManufacturers.map((item) => ({ ...item, checked: false }))
      );
      setPartsManufacturers(
        partsManufacturers.map((item) => ({ ...item, checked: false }))
      );

      setBoilerParts(data);
      setPriceRange([1000, 9000]);
      setIsPriceRangeChanged(false);
    } catch (error) {}
  };

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
        </h2>
        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            {isAnyBoilerManufacturerChecked && (
              <ManufacturersBlock
                title='Производитель котлов:'
                manufacturersList={boilerManufacturers}
                event={updateBoilerManufacturer}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAnyPartsManufacturerChecked && (
              <ManufacturersBlock
                title='Производитель запчастей:'
                manufacturersList={partsManufacturers}
                event={updatePartsManufacturer}
              />
            )}
          </AnimatePresence>
          <div className={styles.catalog__top__inner}>
            <button
              onClick={resetFilters}
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}>
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}>
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect
              setSpinner={setSpinner}
              searchParams={query}
            />
          </div>
        </div>
        <div className={styles.catalog__bottom}>
          <div className={styles.catalog__bottom__inner}>
            <CatalogFilters
              closePopup={closePopup}
              setIsFilterInQuery={setIsFilterInQuery}
              query={query}
              currentPage={currentPage}
              isPriceRangeChanged={isPriceRangeChanged}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              resetFilters={resetFilters}
              filtersMobileOpen={open}
            />
            {spinner ? (
              <ul className={skeletonStyles.skeleton}>
                {Array.from(new Array(20)).map((item, index) => (
                  <li
                    key={index}
                    className={`${skeletonStyles.skeleton__item} ${
                      mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''
                    }`}>
                    <div className={skeletonStyles.skeleton__item__light} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.catalog__list}>
                {boilerParts.rows?.length ? (
                  boilerParts.rows.map((item) => (
                    <CatalogItem
                      item={item}
                      key={item.id}
                    />
                  ))
                ) : (
                  <span>Список товаро пуст</span>
                )}
              </ul>
            )}
          </div>
          <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            nextClassName={styles.catalog__bottom__list__next}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={`${styles.catalog__bottom__list__break__link} ${darkModeClass}`}
            breakLabel='...'
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default CatalogPage;
