import client from "../helper/redis_connection";

const setDataRedisService = (name, value, exprieTime) => {
  return new Promise(async (resolve, reject) => {
    const data = JSON.stringify(value);
    try {
      client.set(name, data, "EX", +exprieTime, (err, reply) => {
        err ? reject(err) : resolve(reply);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDataRedisService = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      client.get(name, (err, reply) => {
        return err ? reject(err) : resolve(reply);
      });
    } catch (error) {
      return reject(error);
    }
  });
};

//
module.exports = {
  setDataRedisService,
  getDataRedisService,
};
