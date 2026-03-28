import { format } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatMonth = (month, year) => {
  if (!month || !year) return '';
  const date = new Date(year, month - 1);
  return format(date, 'MMMM yyyy');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};
