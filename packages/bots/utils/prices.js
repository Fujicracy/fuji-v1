import axios from 'axios';

const getGasPrice = async speed => {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(({ data }) => {
      return data[speed || 'fastest'] * 100000000;
    })
    .catch(error => console.log(error));
};

const getPriceOf = async (currency = 'ethereum') => {
  return axios
    .get(`https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`)
    .then(({ data }) => data[currency].usd);
};

export { getGasPrice, getPriceOf };
