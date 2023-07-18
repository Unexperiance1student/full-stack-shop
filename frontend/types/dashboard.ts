import { IBoilerPart } from './boilerpars';

export interface IDashboardSlider {
  items: IBoilerPart[];
  spinner: boolean;
  goToPartPage?: boolean;
}

export interface ICartAlertProps {
  count: number;
  closeAlert: VoidFunction;
}
