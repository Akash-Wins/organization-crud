import joi from "joi";

const userSchema = joi.object({
  firstName: joi.string().min(5).max(15).trim().required(),
  lastName: joi.string().min(5).max(15).trim().required(),
  email: joi.string().email().min(10).trim().required(),
  userName: joi.string().min(5).max(15).trim().required(),
  password: joi.string().min(5).max(20).trim().required(),
  organization: joi.object({
      orgName: joi.string().min(5).max(20).trim().required(),
      address: joi.object({
          address1: joi.string().min(5).max(20).trim().required(),
          address2: joi.string().min(5).max(20).trim().optional(),
          city: joi.string().min(5).max(15).trim().required(),
          state: joi.string().min(2).max(15).trim().required(),
          country: joi.string().min(5).max(20).trim().required(),
          zipCode: joi.string().min(4).max(8).required(),
        }).optional(),
    }).optional(),
});

const organizationSchema = joi.object({
  orgName: joi.string().min(5).max(20).trim().required(),
  address: joi.object({
      address1: joi.string().min(5).max(20).trim().required(),
      address2: joi.string().min(5).max(20).trim().required(),
      city: joi.string().min(5).max(15).trim().required(),
      state: joi.string().min(2).max(15).trim().required(),
      country: joi.string().min(5).max(20).trim().required(),
      zipCode: joi.string().min(5).max(8).required(),
    }).optional(),
});
const userUpdate = joi.object({
  firstName: joi.string().min(5).max(15).trim().optional(),
  lastName: joi.string().min(5).max(15).trim().optional(),
  email: joi.string().email().min(5).trim().optional(),
  userName: joi.string().min(5).trim().optional(),
  password: joi.string().min(5).max(20).trim().optional(),
  updatePassword:joi.boolean().optional()
});

const orgUpdate = joi.object({
  orgName: joi.string().min(5).max(20).trim().required(),
  address: joi.object({
      address1: joi.string().min(5).max(20).trim().required(),
      address2: joi.string().min(5).max(20).trim().required(),
      city: joi.string().min(5).max(15).trim().required(),
      state: joi.string().min(2).max(15).trim().required(),
      country: joi.string().min(5).max(20).trim().required(),
      zipCode: joi.string().min(5).max(8).required(),
    }).optional(),
})

const login = joi.object({
  userName: joi.string().min(5).trim().required(),
  password: joi.string().min(5).max(20).trim().required(),
});

const validationHelper = (route, method) => {
  let obj = {};
  switch (method) {
    case "post":
      obj = {
        "/add/user": userSchema,
        "/user/login": login,
        "/add/org": organizationSchema,
      };
      return obj[route];
      break;
    case "put":
      obj = {
        "/user/update": userUpdate,
        "/user/orgupdate/:id":orgUpdate
      };
      return obj[route];
      break;
    case "delete":
      obj = {
        "/user/delete": userDelete,
      };
      return obj[route];
      break;
    default:
  }
};

export default validationHelper;
