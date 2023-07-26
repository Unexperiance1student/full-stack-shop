import { useMediaQuery } from '@/hooks/useMediaQuery';
import CatalogFiltersDekstop from './CatalogFiltersDekstop';
import { ICatalogFiltersBaseTypes } from '@/types/catalog';
import { useState } from 'react';

const CatalogFilters = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
}: ICatalogFiltersBaseTypes) => {
  const isMobile = useMediaQuery(820);
  const [spinner, setSpinner] = useState(false);

  return (
    <>
      {isMobile ? (
        <div />
      ) : (
        <CatalogFiltersDekstop
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
