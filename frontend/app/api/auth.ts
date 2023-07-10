import { createEffect } from 'effector-next';
import { toast } from 'react-toastify';
import { ISignUpFx, ISignInFx } from '../../types/auth';
import api from '../axiosClient';

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
