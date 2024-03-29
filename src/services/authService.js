import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(8);

const createNewUser = async (data) => {
    return new Promise(async (res, rej) => {
        try {
            const hashPasswordFromBcrypt = await hashUserPassword(data.password);
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
            res('create user success');
        } catch (error) {
            rej(error);
        }
    });
};
//////////////Hash Data User/////////////////
const hashData = async (data) => {
    return new Promise(async (res, rej) => {
        try {
            const hashData = bcrypt.hashSync(data.toString(), salt);
            res(hashData);
        } catch (error) {
            rej(error);
        }
    });
};
/////////////Hash Password////////////////////
const hashUserPassword = (password) => {
    return new Promise(async (res, rej) => {
        try {
            const hashPassword = bcrypt.hashSync(password, salt);
            res(hashPassword);
        } catch (error) {
            rej(error);
        }
    });
};
module.exports = { createNewUser, hashUserPassword, hashData };
