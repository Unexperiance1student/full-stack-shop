import {
  $boilerParts,
  setBoilerPartsByPopularity,
  setBoilerPartsCheapFirst,
  setBoilerPartsExpensiveFirst,
} from '@/context/boilerParts';
import { $mode } from '@/context/mode';
import {
  controlStyles,
  menuStyles,
  selectStyles,
} from '@/styles/catalog/select';
import { optionStyles } from '@/styles/searchInput';
import { IQueryParams } from '@/types/catalog';
import { IOption, SelectOptionType } from '@/types/common';
import { createSelectOption, queryString } from '@/utils/common';
import { categoriesOptions } from '@/utils/selectContent';
import { useStore } from 'effector-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const FilterSelect = ({
  searchParams,
  setSpinner,
}: {
  searchParams: IQueryParams | any;
  setSpinner: (arg0: boolean) => void;
}) => {
  const mode = useStore($mode);
  const boilerParts = useStore($boilerParts);
  const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (boilerParts.rows) {
      switch (searchParams.first) {
        case 'cheap':
          updateCategoryOption('Сначала дешевые');
          setBoilerPartsCheapFirst();
          break;
        case 'expensive':
          updateCategoryOption('Сначала дорогие');
          setBoilerPartsExpensiveFirst();
          break;
        case 'popular':
          updateCategoryOption('По популярности');
          setBoilerPartsByPopularity();
          break;
        default:
          updateCategoryOption('Сначала дешевые');
          setBoilerPartsCheapFirst();
          break;
      }
    }
  }, [boilerParts.rows, searchParams.first]);

  const updateCategoryOption = (value: string) =>
    setCategoryOption({ value, label: value });

  const updateRoteParam = (first: string) => {
    searchParams.first = first;
    let queryStringParams = queryString(searchParams);

    router.push(`${pathname}?${queryStringParams}`, { shallow: true });
  };

  const handleSortOptionChange = (selectedOption: SelectOptionType) => {
    setSpinner(true);
    setCategoryOption(selectedOption);

    switch ((selectedOption as IOption).value) {
      case 'Сначала дешевые':
        setBoilerPartsCheapFirst();
        updateRoteParam('cheap');
        break;
      case 'Сначала дорогие':
        setBoilerPartsExpensiveFirst();
        updateRoteParam('expensive');
        break;
      case 'По популярности':
        setBoilerPartsByPopularity();
        updateRoteParam('popular');
        break;
    }

    setTimeout(() => setSpinner(false), 1000);
  };
  return (
    <Select
      placeholder='Я ищу...'
      value={categoryOption || createSelectOption('Сначала дешевые')}
      onChange={handleSortOptionChange}
      styles={{
        ...selectStyles,
        control: (defaultStyles) => ({
          ...controlStyles(defaultStyles, mode),
        }),
        input: (defaultStyles) => ({
          ...defaultStyles,
          color: mode === 'dark' ? '#f2f2f2' : '#222222',
        }),
        menu: (defaultStyles) => ({
          ...menuStyles(defaultStyles, mode),
        }),
        option: (defaultStyles, state) => ({
          ...optionStyles(defaultStyles, state, mode),
        }),
      }}
      isSearchable={false}
      options={categoriesOptions}
    />
  );
};

export default FilterSelect;
