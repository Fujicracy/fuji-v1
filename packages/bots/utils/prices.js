import axios from 'axios';

const getGasPrice = async speed => {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(({ data }) => {
      return data[speed || 'fastest'] * 100000000;
    })
    .catch(error => console.log(error));
};

const getETHPrice = async () => {
  return axios
    .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(({ data }) => data.ethereum.usd);
};

export { getGasPrice, getETHPrice };
