export const formatCurrency = (currency) => {
  return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}