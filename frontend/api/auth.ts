import { createEffect } from 'effector-next';
import { toast } from 'react-toastify';
import { ISignUpFx, ISignInFx } from '../types/auth';
import api from './axiosClient';
import { AxiosError } from 'axios';
import { HTTPStatus } from '@/constans';

const config = {
  headers: { 'Content-Type': 'application/json' },
};

export const signUpFx = createEffect(
  async ({ url, username, password, email }: ISignUpFx) => {
    const { data } = await api.post(url, { username, password, email });

    if (data.warningMessage) {
      toast.warning(data.warningMessage);
      return;
    }

    toast.success('Регистрация прощла успешно!');

    return data;
  }
);

export const signInFx = createEffect(
  async ({ url, username, password }: ISignInFx) => {
    const { data } = await api.post(url, { username, password }, config);

    toast.success('Вход выполнен!');

    return data;
  }
);
export const logoutFx = createEffect(async (url: string) => {
  try {
    await api.get(url);
  } catch (error) {
    toast.error((error as Error).message);
  }
});

export const checkUserAuthFx = createEffect(async (url: string) => {
  try {
    const { data } = await api.get(url);

    toast.success('Вход выполнен!');

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      if (axiosError.response.status === HTTPStatus.FORBIDDEN) {
        return false;
      }
    }

    toast.error((error as Error).message);
  }
});
