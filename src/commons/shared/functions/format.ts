export const formatCurrency = (currency) => {
  return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatHyphenDay = (date) => {
  return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
}