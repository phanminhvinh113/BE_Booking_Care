import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { userValidation } from "../helper/validation";
import { getDataRedis, setDataRedis } from "../services/redisService";
import client from "../helper/redis_connection";

dotenv.config();

/// ACCESS TOKEN
const generalAccessToken = (data, exprie) => {
  return new Promise((resolve, reject) => {
    try {
      if (data) {
        const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: exprie,
        });
        resolve(access_token);
      }
    } catch (error) {
      reject(error);
    }
  });
};
const generalRefreshToken = (data, exprie) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data) {
        const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: exprie,
        });
        resolve(refresh_token);
      }
    } catch (error) {
      reject(error);
    }
  });
};
// VERIFY REFRESH TOKEN
const verifyRefreshToken = async (req, res, next) => {
  try {
    const refresh_token_client = req.cookies?.refresh_token;
    const refresh_token_server = await client.get("refresh_token");
    if (refresh_token_server === refresh_token_client) {
      jwt.verify(
        refresh_token_client,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err)
            res.status(200).json({
              errCode: 2,
              message: err.message,
            });
          if (user && user.roleId === "R1") {
            req.user = { email: user.email, roleId: user.roleId };
            next();
          }
        }
      );
    } else {
      return res.status(200).json({
        errCode: 2,
        message: "Not Authorization",
      });
    }
  } catch (error) {
    res.status(400).json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};

// VERIFY ACCCESS TOKEN
const verifyAccessToken = async (req, res, next) => {
  if (!req.headers.access_token) {
    res.status(200).json({
      errCode: 1,
      message: "Invalid Token!",
    });
  }
  const access_token = req.headers.access_token.split(" ")[1];
  jwt.verify(
    access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, user) => {
      if (user && user.roleId === "R1") {
        next();
      } else {
        return res.status(200).json({
          errCode: 1,
          message: err,
        });
      }
    }
  );
};

//REFRESH TOKEN

const refreshTokenMiddlwareAdmin = async (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [refresh_token_client, refresh_token_server] = await Promise.all([
        req.cookies.refresh_token,
        client.get("refresh_token"),
      ]);
      const newAccessToken = await refreshTokenMiddlwareAdmin(
        userPayload,
        refresh_token_client,
        refresh_token_server
      );
      req.newAccessToken = newAccessToken;
      if (
        user.roleId === "R1" &&
        refresh_token_client === refresh_token_server
      ) {
        const newAccessToken = await generalAccessToken(user, "1d");
        if (newAccessToken) {
          resolve(newAccessToken);
        }
      } else {
        reject({
          errCode: -1,
          message: "Failed!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//  VALIDTION LOGGIN
const validationLogginUser = (req, res, next) => {
  const { error } = userValidation(req.body);
  if (error) {
    res.status(200).json({
      errCode: -2,
      message: "Email Not Valid!",
    });
  } else {
    next();
  }
};
// const ACCESS_TOKEN_SECRET = crypto.randomBytes(32).toString("hex");
// const REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString("hex");

//

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  verifyAccessToken,
  validationLogginUser,
  refreshTokenMiddlwareAdmin,
  verifyRefreshToken,
};
