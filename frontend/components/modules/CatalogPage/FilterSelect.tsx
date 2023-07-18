import { $mode } from '@/context/mode';
import {
  controlStyles,
  menuStyles,
  selectStyles,
} from '@/styles/catalog/select';
import { optionStyles } from '@/styles/searchInput';
import { SelectOptionType } from '@/types/common';
import { createSelectOption } from '@/utils/common';
import { useStore } from 'effector-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select from 'react-select';

const FilterSelect = () => {
  const mode = useStore($mode);
  const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null);
  const router = useRouter();

  const handleSortOptionChange = (selectedOption: SelectOptionType) => {
    setCategoryOption(selectedOption);
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
      //   options={categoriesOptions}
    />
  );
};

export default FilterSelect;
