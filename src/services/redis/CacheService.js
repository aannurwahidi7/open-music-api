/* eslint-disable no-underscore-dangle */
const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSeccond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSeccond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) {
      throw new Error('Cache tidak ditemukan');
    }

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }

  check(key) {
    return this._client.get(key).then((isAvailable) => {
      console.log(isAvailable);
      if (isAvailable === null) {
        return false;
      }
      return true;
    });
  }
}

module.exports = CacheService;
