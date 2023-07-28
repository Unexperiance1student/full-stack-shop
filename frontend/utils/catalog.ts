import { NextRouter } from 'next/router';
import { idGenerator, queryString } from './common';
import { getBoilerPartsFx } from '@/api/boilerParts';
import { IQueryParams } from '@/types/catalog';
import { setFilteredBoilerParts } from '@/context/boilerParts';

const createManufacturerCheckboxObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
});

export const boilerManufacturers = [
  'Ariston',
  'Chaffoteaux&Maury',
  'Baxi',
  'Bongioanni',
  'Saunier Duval',
  'Buderus',
  'Strategist',
  'Henry',
  'Northwest',
].map(createManufacturerCheckboxObj);

export const partsManufacturers = [
  'Azure',
  'Gloves',
  'Cambridgeshire',
  'Salmon',
  'Montana',
  'Sensor',
  'Lesly',
  'Radian',
  'Gasoline',
  'Croatia',
].map(createManufacturerCheckboxObj);

export const checkPriceFromQuery = (price: number) =>
  price && !isNaN(price) && price >= 0 && price <= 10000;

export const checkQueryParams = (query: any | IQueryParams) => {
  const priceFromQueryValue = query.priceFrom as string;
  const priceToQueryValue = query.priceTo as string;
  const boilerQueryValue = JSON.parse(decodeURIComponent(query.boiler));
  const partsQueryValue = JSON.parse(decodeURIComponent(query.parts));
  const isValidBoilerQuery =
    Array.isArray(boilerQueryValue) && !!boilerQueryValue?.length;
  const isValidPartsQuery =
    Array.isArray(partsQueryValue) && !!partsQueryValue?.length;
  const isValidPriceQuery =
    checkPriceFromQuery(+priceFromQueryValue) &&
    checkPriceFromQuery(+priceToQueryValue);

  return {
    isValidBoilerQuery,
    isValidPartsQuery,
    isValidPriceQuery,
    priceFromQueryValue,
    priceToQueryValue,
    boilerQueryValue,
    partsQueryValue,
  };
};

export const updateParamsAndFiltersFromQuery = async (
  callback: VoidFunction,
  path: string
) => {
  callback();

  const data = await getBoilerPartsFx(`/boiler-parts?limit=20&offset=${path}`);

  setFilteredBoilerParts(data);
};

// export async function updateParamsAndFilters(
//   updateQuery: IQueryParams | any,
//   path: string,
//   query: any | IQueryParams,
//   router: any,
//   pathname: string
// ) {
//   console.log(updateQuery);
//   delete query.boiler;
//   delete query.parts;
//   delete query.priceTo;
//   delete query.priceFrom;
//   const queryStringParams = queryString(updateQuery);
//   console.log(updateQuery);

//   router.push(`${pathname}?${queryStringParams}`, { shallow: true });
//   const data = await getBoilerPartsFx(`/boiler-parts?limit=20&offset=${path}`);

//   setFilteredBoilerParts(data);
// }
