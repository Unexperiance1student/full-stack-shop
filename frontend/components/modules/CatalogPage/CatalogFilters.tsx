import { useMediaQuery } from '@/hooks/useMediaQuery';
import CatalogFiltersDekstop from './CatalogFiltersDekstop';
import { ICatalogFiltersProps, IQueryParams } from '@/types/catalog';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStore } from 'effector-react';
import {
  $boilerManufacturers,
  $partsManufacturers,
  setBoilerManufacturersFromQuery,
  setFilteredBoilerParts,
  setPartsManufacturersFromQuery,
} from '@/context/boilerParts';
import { usePathname, useRouter } from 'next/navigation';
import {
  checkQueryParams,
  updateParamsAndFiltersFromQuery,
} from '@/utils/catalog';
import { queryString } from '@/utils/common';
import { getBoilerPartsFx } from '@/api/boilerParts';
import CatalogFiltersMobile from './CatalogFiltersMobile';

const CatalogFilters = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  resetFilters,
  isPriceRangeChanged,
  currentPage,
  query,
  setIsFilterInQuery,
  closePopup,
  filtersMobileOpen,
}: ICatalogFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isMobile = useMediaQuery(820);
  const [spinner, setSpinner] = useState(false);
  const boilerManufacturers = useStore($boilerManufacturers);
  const partsManufacturers = useStore($partsManufacturers);

  useEffect(() => {
    applyFiltersFromQuery();
  }, []);

  const applyFiltersFromQuery = async () => {
    try {
      const {
        isValidBoilerQuery,
        isValidPartsQuery,
        isValidPriceQuery,
        priceFromQueryValue,
        priceToQueryValue,
        boilerQueryValue,
        partsQueryValue,
      } = checkQueryParams(query);

      const boilerQuery = `&boiler=${query.boiler}`;
      const partsQuery = `&parts=${query.parts}`;
      const priceQuery = `&priceFrom=${priceFromQueryValue}&priceTo=${priceToQueryValue}`;

      if (isValidBoilerQuery && isValidPartsQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setBoilerManufacturersFromQuery(boilerQueryValue);
          setPartsManufacturersFromQuery(partsQueryValue);
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue);
        }, `${currentPage}${priceQuery}${boilerQuery}${partsQuery}`);

        return;
      }

      if (isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue);
        }, `${currentPage}${priceQuery}`);
      }

      if (isValidBoilerQuery && isValidPartsQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true);
          setBoilerManufacturersFromQuery(boilerQueryValue);
          setPartsManufacturersFromQuery(partsQueryValue);
        }, `${currentPage}${boilerQuery}${partsQuery}`);
        return;
      }

      if (isValidBoilerQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true);
          setBoilerManufacturersFromQuery(boilerQueryValue);
        }, `${currentPage}${boilerQuery}`);
      }

      if (isValidPartsQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true);
          setPartsManufacturersFromQuery(partsQueryValue);
        }, `${currentPage}${partsQuery}`);
      }

      if (isValidPartsQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue);

          setPartsManufacturersFromQuery(partsQueryValue);
        }, `${currentPage}${priceQuery}${partsQuery}`);
      }

      if (isValidBoilerQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue);

          setBoilerManufacturersFromQuery(boilerQueryValue);
        }, `${currentPage}${priceQuery}${boilerQuery}`);
      }
    } catch (error) {
      const err = error as Error;
      if (err.message === 'URI malformed') {
        toast.warning('Неправильный url для фильтров');
        return;
      }
      toast.error((error as Error).message);
    }
  };

  const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
    setIsFilterInQuery(true);
    setPriceRange([+priceFrom, +priceTo]);
    setIsPriceRangeChanged(true);
  };
  async function updateParamsAndFilters(
    updateQuery: IQueryParams | any,
    path: string
  ) {
    delete query.boiler;
    delete query.parts;
    delete query.priceTo;
    delete query.priceFrom;
    const queryStringParams = queryString(updateQuery);

    router.push(`${pathname}?${queryStringParams}`, { shallow: true });
    const data = await getBoilerPartsFx(
      `/boiler-parts?limit=20&offset=${path}`
    );

    setFilteredBoilerParts(data);
  }

  const applyFilters = async () => {
    setIsFilterInQuery(true);
    try {
      setSpinner(true);
      const priceTo = Math.ceil(priceRange[1]);
      const priceFrom = Math.ceil(priceRange[0]);
      const priceQuery = isPriceRangeChanged
        ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
        : '';

      const boilers = boilerManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title);

      const parts = partsManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title);

      const encodedBoilerQuery = encodeURIComponent(JSON.stringify(boilers));
      const encodedPartsQuery = encodeURIComponent(JSON.stringify(parts));
      const boilerQuery = `&boiler=${encodedBoilerQuery}`;
      const partsQuery = `&parts=${encodedPartsQuery}`;
      const initialPage = currentPage > 0 ? 0 : currentPage;

      if (boilers.length && parts.length && isPriceRangeChanged) {
        query.boiler = encodedBoilerQuery;
        query.parts = encodedPartsQuery;
        query.priceFrom = priceFrom;
        query.priceTo = priceTo;
        query.offset = initialPage + 1;
        const updateQuery = {
          boiler: encodedBoilerQuery,
          parts: encodedPartsQuery,
          priceFrom: priceFrom,
          priceTo: priceTo,
          offset: initialPage + 1,
        };

        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${boilerQuery}${partsQuery}${priceQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }

      if (isPriceRangeChanged) {
        query.priceFrom = priceFrom;
        query.priceTo = priceTo;
        query.offset = initialPage + 1;
        const updateQuery = {
          priceFrom: priceFrom,
          priceTo: priceTo,
          offset: initialPage + 1,
        };

        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${priceQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }

      if (boilers.length && parts.length) {
        query.boiler = encodedBoilerQuery;
        query.parts = encodedPartsQuery;
        query.offset = initialPage + 1;
        const updateQuery = {
          boiler: encodedBoilerQuery,
          parts: encodedPartsQuery,
          offset: initialPage + 1,
        };

        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${boilerQuery}${partsQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }
      if (parts.length) {
        query.parts = encodedPartsQuery;
        query.offset = initialPage + 1;
        const updateQuery = {
          parts: encodedPartsQuery,
          offset: initialPage + 1,
        };

        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${partsQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }
      if (parts.length && isPriceRangeChanged) {
        query.priceFrom = priceFrom;
        query.priceTo = priceTo;
        query.parts = encodedPartsQuery;
        query.offset = initialPage + 1;
        const updateQuery = {
          priceFrom: priceFrom,
          priceTo: priceTo,
          parts: encodedPartsQuery,
          offset: initialPage + 1,
        };

        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${partsQuery}${priceQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }
      if (boilers.length) {
        query.boiler = encodedBoilerQuery;
        query.offset = initialPage + 1;
        const updateQuery = {
          boiler: encodedBoilerQuery,
          offset: initialPage + 1,
        };

        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${boilerQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }
      if (boilers.length && isPriceRangeChanged) {
        query.priceFrom = priceFrom;
        query.priceTo = priceTo;
        query.boiler = encodedBoilerQuery;
        query.offset = initialPage + 1;
        const updateQuery = {
          boiler: encodedBoilerQuery,
          priceFrom: priceFrom,
          priceTo: priceTo,
          offset: initialPage + 1,
        };
        updateParamsAndFilters(
          updateQuery,
          `${initialPage}${boilerQuery}${priceQuery}`
          // query,
          // router,
          // pathname
        );

        return;
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSpinner(false);
    }
  };
  return (
    <>
      {isMobile ? (
        <CatalogFiltersMobile
          closePopup={closePopup}
          spinner={spinner}
          applyFilters={applyFilters}
          priceRange={priceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          setPriceRange={setPriceRange}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          resetFilters={resetFilters}
          filtersMobileOpen={filtersMobileOpen}
        />
      ) : (
        <CatalogFiltersDekstop
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          spinner={spinner}
        />
      )}
    </>
  );
};

export default CatalogFilters;
