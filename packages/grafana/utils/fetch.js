const axios = require("axios");
const { ETHUSDC, ETHDAI } = require("./vaults");

const Compound = {
  getAccount: async () => {
    let res;
    try {
      res = await axios.get("https://api.compound.finance/api/v2/account", {
        params: {
          addresses: [ETHUSDC, ETHDAI],
        },
      });
    } catch (err) {
      console.log(err);
    }
    return res;
  },
  getETHPrice: async () => {
    let res;
    try {
      res = await axios.get("https://api.compound.finance/api/v2/account", {
        params: {
          addresses: [ETHUSDC, ETHDAI],
        },
      });
    } catch (err) {
      console.log(err);
    }
    return res;
  }
};

const Borrow = {
  aave: async () => {},

  dydx: async () => {},

  compound: async () => {
    const res = (await Compound.getAccount()).data;
    const [DAIacc, USDCacc] = res.accounts;
    // console.log("USDCacc", USDCacc);
    // console.log("DAIacc", DAIacc);

    // console.log("USDCacc tokens", USDCacc.tokens);
    // console.log("DAIacc tokens", DAIacc.tokens);
    const [cUSDC, cETHusdc] = USDCacc.tokens;
    const [cETHdai, cDAI] = DAIacc.tokens;
    console.log("cETHdai", cETHdai);
    console.log("cETHusdc", cETHusdc);
    console.log("cUSDC", cUSDC);
    console.log("cDAI", cDAI);

    const stats = {
      daiDebt: cDAI.borrow_balance_underlying,
      usdcDebt: cUSDC.borrow_balance_underlying,
      daiCollateral: cDAI.
    };
  },
};

const Collateral = {
  aave: async () => {},

  dydx: async () => {},

  compound: async () => {},
};

module.exports = {
  Borrow,
  Collateral,
};

console.log("USDC", ETHUSDC);
console.log("DAI", ETHDAI);
Borrow.compound();
