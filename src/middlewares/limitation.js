import client from '../helper/redis_connection';
import { setDataRedisService, getDataRedisService } from '../services/redisService';
import { RESPONSE } from '../util/constant';
import dotenv from 'dotenv';
dotenv.config();
//
const incr = (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.incr(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        } catch (error) {
            reject(error);
        }
    });
};
const expire = (key, ttl) => {
    return new Promise(async (resolve, reject) => {
        try {
            await client.expire(key, ttl, (err, reply) => {
                return err ? reject(err) : resolve(reply);
            });
        } catch (error) {
            reject(error);
        }
    });
};
//
const limitRequestApi = async (req, res, next) => {
    try {
        const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const numBerRequest = await incr(ipUser);
        if (numBerRequest === 1) {
            await expire(ipUser, 60);
        }
        if (numBerRequest > process.env.RATE_LIMITATION_API) {
            return res.status(200).json({
                errCode: RESPONSE.SERVER_BUSY,
                numBerRequest,
                message: 'Server Busy!',
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({
            errCode: RESPONSE.ERROR,
            message: error,
        });
    }
};
module.exports = {
    incr,
    limitRequestApi,
    expire,
};
