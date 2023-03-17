import db from "../models/index";
import {
  handleInfoExistService,
  userServiceLogIn,
  getAllUsers,
  createNewUserSerVice,
  updateUserService,
  deleteUserService,
  getAllCodeService,
  searchAllService,
  userServiceRegister,
  userServiceLogout,
} from "../services/userService";
import { generalRefreshToken } from "../middlewares/auth";
import client from "../helper/redis_connection";

//// HANDLE CHECK INFO EXIST
const handleInfoExist = async (req, res) => {
  try {
    const response = await handleInfoExistService(
      req.query.field,
      req.query.value
    );
    if (response) return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};
/////////////////// HANDLE REGISTER USER /////////
const handleRegister = async (req, res) => {
  try {
    const response = await userServiceRegister(req.body);
    if (response) return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: `Error: ${error}`,
    });
  }
};
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
          path: "http://localhost:8085",
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
//////////////// HANDLE LOG OUT //////////
const handleLogout = async (req, res) => {
  try {
    const response = await userServiceLogout(req.body.data);
    if (response) return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
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
    const users = await getAllUsers(id, req.roleId);

    res.json({
      errCode: 0,
      message: "OK!",
      users: users,
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
  handleInfoExist,
  handleRegister,
  handleLogIn,
  handleLogout,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  getAllCode,
  searchAll,
};
