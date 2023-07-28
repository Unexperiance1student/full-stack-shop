import { NextRouter } from 'next/router';

export const getWindowWidth = () => {
  const { innerWidth: windowWidth } =
    typeof window !== 'undefined' ? window : { innerWidth: 0 };

  return { windowWidth };
};

export const formatPrice = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const createSelectOption = (value: string | number) => ({
  value,
  label: value,
});

export const idGenerator = () => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
};

export const toggleClassNamesForOverlayAndBody = (
  overlayClassName = 'open'
) => {
  document.querySelector('.overlay')?.classList.toggle(overlayClassName);
  document.querySelector('.body')?.classList.toggle('overflow-hidden');
};

export const removeClassNamesForOverlayAndBody = () => {
  document.querySelector('.overlay')?.classList.remove('open');
  document.querySelector('.overlay')?.classList.remove('open-search');
  document.querySelector('.body')?.classList.remove('overflow-hidden');
};

export const queryString = (query: any) => {
  return Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};
