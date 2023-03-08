import joi from "joi";
//
const userValidation = (data) => {
  const userSchema = joi.object({
    email: joi
      .string()
      .pattern(new RegExp("gmail.com$"))
      .email()
      .lowercase()
      .required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .max(30)
      .required(),
  });
  return userSchema.validate(data);
};
//

module.exports = {
  userValidation,
};
