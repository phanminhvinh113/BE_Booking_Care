import {
  getDataRedisService,
  setDataRedisService,
} from "../services/redisService";

const setDataRedis = async (req, res, next) => {
  try {
    if (!req.key) {
      return res.status(200).json({
        errCode: 1,
        message: "KEY?",
      });
    }
    await setDataRedisService(req.key, req.data);
    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: req.data,
    });
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};

const getDataRedis = async (req, res, next) => {
  try {
    const data = await getDataRedisService(req.headers.key);
    if (!!data) {
      return res.status(200).json({
        errCode: 0,
        message: "OK!",
        data: JSON.parse(data),
        redis_store: "Exist",
      });
    } else {
      req.key = req.headers.key;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDataRedis,
  setDataRedis,
};
