import redis from 'redis';
import { promisify } from 'util';

export const connectRedis = async () => {
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
