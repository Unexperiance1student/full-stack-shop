import { createEffect } from 'effector-next';
import api from './axiosClient';

export const getBetsellersOrNewPartsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url);

  return data;
});

export const getBoilerPartsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url);

  return data;
});
