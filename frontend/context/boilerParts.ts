import { IBoilerParts } from '@/types/boilerpars';
import { createDomain } from 'effector-next';

const boilerParts = createDomain();

export const setBoilerParts = boilerParts.createEvent<IBoilerParts>();
export const setBoilerPartsCheapFirst = boilerParts.createEvent();
export const setBoilerPartsExpensiveFirst = boilerParts.createEvent();
export const setBoilerPartsByPopularity = boilerParts.createEvent();

export const $boilerParts = boilerParts
  .createStore<IBoilerParts>({} as IBoilerParts)
  .on(setBoilerParts, (_, parts) => parts)
  .on(setBoilerPartsCheapFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.price - b.price),
  }))
  .on(setBoilerPartsExpensiveFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.price - a.price),
  }))
  .on(setBoilerPartsByPopularity, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.popularity - a.popularity),
  }));
