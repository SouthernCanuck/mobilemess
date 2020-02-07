import WorkOrderStatus from 'types/workOrderStatus';

const colors = {
  black: '#000',
  white: '#FFF',
  blue: '#3461DE',
  blueDark: '#04104C',
  red: '#ED3870',
  yellow: '#FFCE00',
  green: '#11A34D',
  border: '#BBCEE6',
  switchTrack: '#F0F2FC',
  label: '#61697E',
  textLight: '#61656F',
  placeholder: '#B3B8C5',
  whiteOpaque: 'rgba(255, 255, 255, 0.2)',
  link: '#355EDE',
  inputs: {
    dark: '#3F3F3F',
  },
};

export const statusColors = {
  [WorkOrderStatus.AVAILABLE]: '#11A34D',
  [WorkOrderStatus.REVISION]: '#ED3870',
  [WorkOrderStatus.UNSCHEDULED]: '#F3F6FB',
  [WorkOrderStatus.IN_PROGRESS]: '#FFCE00',
  [WorkOrderStatus.SCHEDULED]: '#3461DE',
  [WorkOrderStatus.EXPIRED]: '#B3B8C5',
  [WorkOrderStatus.SUBMITTED]: '#BBCEE6',
};

export default colors;
