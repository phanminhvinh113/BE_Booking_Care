import joi from "joi";
//
const userRegisterValidation = (data) => {
  const userSchema = joi.object({
    firstName: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{2,15}$"))
      .min(2)
      .max(15)
      .required(),
    lastName: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{2,15}$"))
      .min(2)
      .max(15)
      .required(),
    email: joi
      .string()
      .pattern(new RegExp("gmail.com$"))
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "vn"] } })
      .lowercase()
      .required(),
    password: joi.string().min(6).max(30).required(),
  });
  return userSchema.validate(data);
};
//
const userValidation = (data) => {
  const userSchema = joi.object({
    email: joi
      .string()
      .pattern(new RegExp("gmail.com$"))
      .email()
      .lowercase()
      .required(),
    password: joi.string().min(6).max(30).required(),
  });
  return userSchema.validate(data);
};

module.exports = {
  userValidation,
  userRegisterValidation,
};
