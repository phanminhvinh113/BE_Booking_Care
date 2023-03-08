import db from "../models/index";
import {
  userServiceLogIn,
  getAllUsers,
  createNewUserSerVice,
  updateUserService,
  deleteUserService,
  getAllCodeService,
  searchAllService,
} from "../services/userService";
import { generalRefreshToken } from "../middlewares/auth";
import client from "../helper/redis_connection";

//////////////////[POST] HANDLE LOG IN USER////////////
const handleLogIn = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const response = await userServiceLogIn(email, password);
    if (response.errCode === 0) {
      // Assigning refresh token in http-only cookie and sign refresh token
      const refresh_token = await generalRefreshToken(
        {
          roleId: response.user?.roleId,
          id: response.user?.id,
          email: response.user.email,
        },
        "365d"
      );
      // SAVE
      await Promise.all([
        client.set("refresh_token", refresh_token, "EX", 365 * 24 * 60 * 60),
        res.cookie("refresh_token", refresh_token, {
          httpOnly: "true",
          secure: "false",
          path: "/",
          sameSite: "Strict",
        }),
      ]);
    }
    return res.status(200).json(response);
  } catch (error) {
    res.json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};

/////////////// GET ALL CODE //////////////
const getAllCode = async (req, res) => {
  try {
    const type = req.query.type;
    const data = await getAllCodeService(type);

    if (data) {
      res.status(200).json({
        errCode: 0,
        message: "OK!",
        data: data,
      });
    }
  } catch (error) {
    res.status(400).json({
      errCode: 1,
      message: `Error: ${error} `,
    });
  }
};

/////////////////[GET] GET ALL USER /////////////////////
const getAllUser = async (req, res) => {
  try {
    const id = req.query.id; //ALL or ID(singleUser)

    if (!id) {
      res.json({
        errCode: 1,
        message: "Missing Input Parameters",
        users: [],
      });
    }
    const users = await getAllUsers(id);
    const newAccessToken = req.newAccessToken || " ";
    res.json({
      errCode: 0,
      message: "OK!",
      users: users,
      newAccessToken: newAccessToken,
    });
  } catch (error) {
    res.json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};
/////////////// CREATE NEW USER /////////////////////

const createUser = async (req, res) => {
  const message = await createNewUserSerVice(req.body);
  return res.status(200).json(message);
};
////////////// UPDATE USER //////////////////////

const updateUser = async (req, res) => {
  if (!req.body) {
    res.json({
      errCode: 1,
      message: "Missing Parameters",
    });
  } else {
    const message = await updateUserService(req.body);
    return res.status(200).json(message);
  }
};

////////////// DELETE USER //////////////////////

const deleteUser = async (req, res) => {
  if (!req.body.id) {
    res.json({
      errCode: 1,
      message: "Missing Parameters",
    });
  } else {
    const message = await deleteUserService(req.body.id);
    return res.status(200).json(message);
  }
};
//
const searchAll = async (req, res) => {
  try {
    const inputSearch = req.query.s.toLowerCase();
    console.log(inputSearch);
    const response = await searchAllService(inputSearch);
    if (response && response.errCode === 0) {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(404).json({
      errCode: -1,
      message: `Error ${error}`,
    });
  }
};
////////////////EXPORTS///////////////////

module.exports = {
  handleLogIn,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  getAllCode,
  searchAll,
};
