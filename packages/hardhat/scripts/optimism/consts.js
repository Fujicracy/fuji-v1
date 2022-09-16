const ASSETS = {
  ETH: {
    name: "eth",
    nameUp: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    oracle: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    aTokenV3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    decimals: 18,
  },
  DAI: {
    name: "dai",
    nameUp: "DAI",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    oracle: "0x8dBa75e83DA73cc766A7e5a0ee71F656BAb470d6",
    aTokenV3: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
    decimals: 18,
  },
  USDC: {
    name: "usdc",
    nameUp: "USDC",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    oracle: "0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3",
    aTokenV3: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    decimals: 6,
  },
  WETH: {
    name: "weth",
    nameUp: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    oracle: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    aTokenV3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    decimals: 18,
  },
  WBTC: {
    name: "wbtc",
    nameUp: "WBTC",
    address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    oracle: "0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593",
    aTokenV3: "0x078f358208685046a11C85e8ad32895DED33A249",
    decimals: 8,
  },
};

const ZIPSWAP_ROUTER_ADDR = "0xE6Df0BB08e5A97b40B21950a0A51b94c4DbA0Ff6";

module.exports = {
  ASSETS,
  ZIPSWAP_ROUTER_ADDR,
};
