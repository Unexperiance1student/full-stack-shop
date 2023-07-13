import { $mode } from '@/context/mode';
import { SelectOptionType } from '@/types/common';
import { useStore } from 'effector-react';
import { MutableRefObject, useRef, useState } from 'react';
import Select from 'react-select';
import {
  controlStyles,
  inputStyles,
  menuStyles,
  optionStyles,
} from '@/styles/searchInput';
import styles from '@/styles/header/index.module.scss';
import { useRouter } from 'next/navigation';

const SearchInput = () => {
  const mode = useStore($mode);
  const [searchOption, setSearchOption] = useState<SelectOptionType>(null);
  const [onMenuOpenControlStyles, setOnMenuOpenControlStyles] = useState({});
  const [onMenuOpenContainerStyles, setOnMenuOpenContainerStyles] = useState(
    {}
  );
  const zIndex = 1;
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : '';
  const btnRef = useRef() as MutableRefObject<HTMLButtonElement>;
  const borderRef = useRef() as MutableRefObject<HTMLSpanElement>;
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSearchOptionChange = (selectedOption: SelectOptionType) => {
    setSearchOption(selectedOption);
  };

  return (
    <Select
      placeholder='Я ищу...'
      value={searchOption}
      onChange={handleSearchOptionChange}
      styles={{
        ...inputStyles,
        container: (defaultStyles) => ({
          ...defaultStyles,
          ...onMenuOpenContainerStyles,
        }),
        control: (defaultStyles) => ({
          ...controlStyles(defaultStyles, mode),
          backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
          zIndex,
          transition: 'none',
          ...onMenuOpenControlStyles,
        }),
        input: (defaultStyles) => ({
          ...defaultStyles,
          color: mode === 'dark' ? '#f2f2f2' : '#222222',
        }),
        menu: (defaultStyles) => ({
          ...menuStyles(defaultStyles, mode),
          zIndex,
          marginTop: '-1px',
        }),
        option: (defaultStyles, state) => ({
          ...optionStyles(defaultStyles, state, mode),
        }),
      }}
      isClearable={true}
      openMenuOnClick={false}
    />
  );
};
export default SearchInput;
