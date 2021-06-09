/* eslint-disable prettier/prettier */
const { promisify } = require('util');
const redis = require('redis');

const connectRedis = async () => {
  const client = redis.createClient({ port: 6379 });

  // console.log(client);

  client.on('error', function (error) {
    console.error(error);
  });

  const methods = {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    hmset: promisify(client.hmset).bind(client),
  };

  return methods;
};

const longSearchBorrowers = async vault => {
  const filterBorrowers = vault.filters.Borrow();
  const events = await vault.queryFilter(filterBorrowers, 1000);
  const borrowers = events
    .map(e => e.args.userAddrs)
    .reduce((acc, userAddr) => (acc.includes(userAddr) ? acc : [...acc, userAddr]), []);
  return borrowers;
};

const shortSearchBorrowers = async vault => {
  const filterBorrowers = vault.filters.Borrow();
  const events = await vault.queryFilter(filterBorrowers, 1000);
  const borrowers = events
    .map(e => e.args.userAddrs)
    .reduce((acc, userAddr) => (acc.includes(userAddr) ? acc : [...acc, userAddr]), []);
  return borrowers;
};

module.exports = { longSearchBorrowers, shortSearchBorrowers, connectRedis };
