import { getBoilerPartsFx } from '@/api/boilerParts';
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem';
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect';
import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock';
import { $boilerParts, setBoilerParts } from '@/context/boilerParts';
import { $mode } from '@/context/mode';
import styles from '@/styles/catalog/index.module.scss';
import skeletonStyles from '@/styles/skeleton/index.module.scss';
import { IBoilerParts } from '@/types/boilerpars';
import { IQueryParams } from '@/types/catalog';
import { useStore } from 'effector-react';
import { AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const CatalogPage = ({ query }: { query: IQueryParams | any }) => {
  const pathname = usePathname();
  const mode = useStore($mode);
  const boilerParts = useStore($boilerParts);
  const [isFilterInQuery, setIsFilterInQuery] = useState(false);
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const isValidOffset =
    query.offset && !isNaN(+query.offset) && +query.offset > 0;
  const [currentPage, setCurrentPage] = useState(
    isValidOffset ? +query.offset - 1 : 0
  );
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';
  const pagesCount = Math.ceil(boilerParts.count / 20);
  const router = useRouter();

  useEffect(() => {
    loadBoilerParts();
  }, []);

  const loadBoilerParts = async () => {
    try {
      setSpinner(true);
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0');

      if (!isValidOffset) {
        query.offset = '1';
        const queryString = Object.entries(query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        router.replace(`${pathname}?${queryString}`);

        resetPagination(data);
        return;
      }

      if (isValidOffset) {
        if (+query.offset > Math.ceil(data.count / 20)) {
          const queryString = Object.entries(query)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
          query.offset = '1';

          router.push(`${pathname}?${queryString}`, { shallow: true });

          setCurrentPage(0);
          setBoilerParts(data);
          return;
        }

        const offset = +query.offset - 1;
        const result = await getBoilerPartsFx(
          `/boiler-parts?limit=20&offset=${offset}`
        );

        setCurrentPage(offset);
        setBoilerParts(result);
        return;
      }

      setCurrentPage(0);
      setBoilerParts(data);
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
        resetPagination(data);
        return;
      }

      if (isValidOffset && +query.offset > Math.ceil(data.count / 2)) {
        resetPagination(data);
        return;
      }

      const result = await getBoilerPartsFx(
        `/boiler-parts?limit=20&offset=${selected}`
      );

      query.offset = selected + 1;
      const queryString = Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      router.push(`${pathname}?${queryString}`, { shallow: true });
      setCurrentPage(selected);
      setBoilerParts(result);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setTimeout(() => setSpinner(false), 1000);
    }
  };
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
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={true}>
              Сбросить фильтр
            </button>
            <FilterSelect
              setSpinner={setSpinner}
              searchParams={query}
            />
          </div>
        </div>
        <div className={styles.catalog__bottom}>
          <div className={styles.catalog__bottom__inner}>
            <div>Filters</div>
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
