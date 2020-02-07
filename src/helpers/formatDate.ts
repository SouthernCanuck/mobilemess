import moment from 'moment';

export const formatDate = (date: Date) => moment(date).format('DD MMMM');

export const formatDateTime = (date: Date) => moment(date).format('ddd DD MMMM h:mma');

export const formatExpirationTime = (date: Date) => {
  const minutesLeft = (new Date(date).getTime() - new Date().getTime()) / (60 * 1000);
  const hours = Math.ceil(minutesLeft / 60);
  const minutes = Math.ceil(minutesLeft % 60);
  if (hours <= 0) {
    return `${minutes}min`;
  }
  return `${hours}h ${minutes}min`;
};
