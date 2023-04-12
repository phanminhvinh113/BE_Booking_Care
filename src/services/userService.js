import db from '../models';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Sequelize } from '../models';
import { hashUserPassword, hashData } from './authService';
import { generalAccessToken } from '../middlewares/auth';
import { convertToImageBase64 } from '../helper/convertImage';

//
const Op = Sequelize.Op;
//
dotenv.config();
//
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
// INFOR USER EXISTED
const handleInfoExistService = (field, value) => {
    return new Promise(async (res, rej) => {
        try {
            if (!field || !value) {
                res({
                    errCode: 1,
                    message: 'Missing Parameters',
                });
            }
            //
            const response = await db.User.findOne({
                where: {
                    [field]: value,
                },
            });
            //
            res({
                errCode: 0,
                isExist: response ? true : false,
                message: response ? capitalizeFirstLetter(field) + ' đã tồn tại!' : 'No Existed',
            });
        } catch (error) {
            rej(error);
        }
    });
};
///////////// USER REGISTERN SERVICE ///
const userServiceRegister = ({ firstName, lastName, email, password }) => {
    return new Promise(async (res, rej) => {
        try {
            const isExist = await checkUserEmail(email);
            if (isExist) {
                res({
                    errCode: 1,
                    message: 'Your email already used, try another email!',
                });
            } else {
                const hashPasswordFromBcrypt = await hashUserPassword(password);
                await db.User.create({
                    firstName,
                    lastName,
                    email,
                    password: hashPasswordFromBcrypt,
                    roleId: 'R3',
                });
                res({
                    errCode: 0,
                    message: 'OK!',
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};
////////////USER SERVICE LOGIN//////////////
const userServiceLogIn = (email, password) => {
    return new Promise(async (res, rej) => {
        try {
            const isExist = await checkUserEmail(email);
            if (isExist) {
                const user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'firstName', 'lastName', 'roleId', 'password', 'image'],
                    raw: true,
                });
                if (user) {
                    const checkPassword = bcrypt.compareSync(password, user.password);
                    if (checkPassword) {
                        user.image = user.image ? Buffer.from(user.image, 'base64').toString('binary') : null;
                        delete user.password;
                        const access_token = await generalAccessToken({ id: user.id, email: user.email, roleId: user.roleId }, '6h');
                        res({
                            errCode: 0,
                            message: 'Success',
                            user,
                            token: {
                                access_token,
                            },
                        });
                    } else {
                        res({
                            errCode: 3,
                            message: 'Incorrect Password',
                        });
                    }
                } else {
                    res({
                        errCode: 2,
                        message: 'User not found',
                    });
                }
            } else {
                res({
                    errCode: 1,
                    message: 'Email not available',
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};
////////// USER LOG OUT //////////////////
const userServiceLogout = ({ email, id }) => {
    return new Promise(async (res, rej) => {
        try {
            if (!email || !id) {
                res({
                    errCode: 1,
                    message: 'Missing Parameters',
                });
            } else {
                const user = await db.User.findOne({
                    where: {
                        email: email,
                        id: id,
                    },
                });
                if (user) res({ errCode: 0, message: 'Logout' });
                else res({ errCode: 2, message: 'Logout Failed' });
            }
        } catch (error) {
            rej(error);
        }
    });
};
///////////////CHECK EMAIL USER//////////////////

const checkUserEmail = (userEmail) => {
    return new Promise(async (res, rej) => {
        try {
            const user = await db.User.findOne({
                where: { email: userEmail },
            });
            user ? res(user) : res(false);
        } catch (error) {
            rej(error);
        }
    });
};

/////////////////GET ALL USER OR SINGLE USER/////////////////
const getAllUsers = (userId, roleId, users) => {
    return new Promise(async (res, rej) => {
        try {
            if (userId === 'ALL' && roleId === 'R1') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password', 'deletedAt'],
                    },
                });
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password', 'deletedAt'],
                    },
                    where: { id: userId },
                });
            }
            res(users);
        } catch (error) {
            rej(error);
        }
    });
};

///////////////////// CREATE USER /////////////////////////////
const createNewUserSerVice = (data) => {
    return new Promise(async (res, rej) => {
        try {
            //Check Email Existed
            const checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                res({
                    errCode: 1,
                    message: 'Your email already used, typing another email',
                });
            } else {
                const hashPasswordFromBcrypt = await hashUserPassword(data.password);
                const hashPhoneNumberFromBrcypt = await hashData(data.phonenumber);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: hashPhoneNumberFromBrcypt,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.image,
                });
                res({
                    errCode: 0,
                    message: 'OK',
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};
/////////////////UPDATE USER///////////////////
const updateUserService = (data) => {
    return new Promise(async (res, rej) => {
        try {
            const userUpdate = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (!userUpdate || !data.id) {
                res({
                    errCode: 2,
                    message: 'Not Found User',
                });
            }
            userUpdate.set({
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                address: data.address,
                roleId: data.roleId,
                positionId: data.positionId,
                image: data.image,
            });
            await userUpdate.save();
            res({
                errCode: 0,
                message: 'Update Success',
            });
        } catch (error) {
            rej({
                errCode: 2,
                message: 'Error',
            });
        }
    });
};

/////////////////DELETE USER///////////////////
const deleteUserService = (userId) => {
    return new Promise(async (res, rej) => {
        try {
            if (!userId) {
                res({
                    errCode: 2,
                    message: 'Not Found User',
                });
            } else {
                await db.User.destroy({
                    where: { id: userId },
                });
            }
            res({
                errCode: 0,
                message: 'delete success',
            });
        } catch (error) {
            rej({
                errCode: 3,
                message: 'delete fail',
            });
        }
    });
};
////// GET ALL CODE ///////
const getAllCodeService = async (typeUser) => {
    return new Promise(async (res, rej) => {
        try {
            const response = await db.AllCodes.findAll({
                where: { type: typeUser },
            });
            if (response) {
                res(response);
            } else {
                res({
                    errCode: 2,
                    message: 'Missing Parameters',
                });
            }
        } catch (error) {
            rej({
                errCode: 1,
                message: 'Something Wrong! ',
            });
        }
    });
};
///////?????////SEARCH ALL INPUT//////?????////////
// DOCTOR SEARCH //
const searchDoctorService = (inputSearch) => {
    return new Promise(async (res, rej) => {
        try {
            const data = await db.DoctorInfo.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
                                [Op.like]: `%${inputSearch}%`,
                            }),
                        },
                        {
                            addressClinic: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('addressClinic')), {
                                [Op.like]: `%${inputSearch}%`,
                            }),
                        },
                    ],
                },
                attributes: ['name', 'nameClinic', 'addressClinic', 'doctorId'],
                include: [
                    {
                        model: db.User,
                        attributes: ['image', 'firstName', 'lastName'],
                    },
                    {
                        model: db.AllCodes,
                        as: 'specs',
                        attributes: ['valueEN', 'valueVI'],
                    },
                ],
                raw: true,
                nest: true,
            });
            ///
            if (!!data) {
                data.forEach(({ User }) => {
                    User.image = Buffer.from(User.image, 'base64').toString('binary');
                });
                res(data);
            } else {
                res([]);
            }
        } catch (error) {
            rej(error);
        }
    });
};
// DOCTOR  SPECIALTY //
const searchSpecialtyService = (inputSearch) => {
    return new Promise(async (res, rej) => {
        try {
            const data = await db.Specialty.findAll({
                where: {
                    name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
                        [Op.like]: `%${inputSearch}%`,
                    }),
                },
                attributes: ['name', 'image', 'specialtyId'],
                include: [
                    {
                        model: db.AllCodes,
                        as: 'specialtyValue',
                        attributes: ['valueEN', 'valueVI'],
                    },
                ],
                raw: true,
                nest: true,
            });
            ///
            if (!!data) {
                convertToImageBase64(data);
                res(data);
            } else {
                res([]);
            }
        } catch (error) {
            rej(error);
        }
    });
};
const searchClinicService = (inputSearch) => {
    return new Promise(async (res, rej) => {
        try {
            const data = await db.Clinic.findAll({
                where: {
                    name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
                        [Op.like]: `%${inputSearch}%`,
                    }),
                },
                attributes: ['name', 'image'],
                raw: true,
                nest: true,
            });
            ///
            if (!!data) {
                convertToImageBase64(data);
                res(data);
            } else {
                res([]);
            }
        } catch (error) {
            rej(error);
        }
    });
};
////
const searchAllService = (inputSearch) => {
    return new Promise(async (res, rej) => {
        try {
            const [dataDoctor, dataSpecialty, dataClinic] = await Promise.all([searchDoctorService(inputSearch), searchSpecialtyService(inputSearch), searchClinicService(inputSearch)]);

            if (dataDoctor || dataClinic || dataSpecialty) {
                res({
                    errCode: 0,
                    message: 'OK!',
                    dataDoctor,
                    dataSpecialty,
                    dataClinic,
                });
            } else {
                res({
                    errCode: 1,
                    message: 'not found!',
                    data: [],
                });
            }
        } catch (error) {
            rej(error);
        }
    });
};
//////////////EXPORTS/////////////////
module.exports = {
    handleInfoExistService,
    userServiceLogIn,
    userServiceLogout,
    getAllUsers,
    createNewUserSerVice,
    updateUserService,
    deleteUserService,
    getAllCodeService,
    searchAllService,
    userServiceRegister,
};
