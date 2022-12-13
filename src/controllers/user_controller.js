import user from "../models/user.js";
import MESSAGE from "../helpers/message.js";
import Response from "../helpers/response.js";
import organization from "../models/organization.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import joi from "joi";

class UserController {
  async addUser(req, res) {
    try {
      const userName = await user.findOne({ userName: req.body.userName });
      if (userName) {
        let resPayload = {
          message: MESSAGE.USER_NAME_EXIST,
        };
        return Response.error(res, resPayload);
      }
      const users = new user(req.body);
      const idUser = users._id;

      const attribute = {
        orgName: req.body.organization.orgName,
        userId: idUser,
        address: req.body.organization.address,
      };
      const orgs = new organization(attribute);

      users.save();
      orgs.save();
      let resPayload = {
        message: MESSAGE.REGISTER_SUCCESSFULLY,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async login(req, res) {
    try {
      let userName = await user.findOne({ userName: req.body.userName });
      if (!userName) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Response.error(res, resPayload);
      }
      if (userName.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_FOUND,
        };
        return Response.error(res, resPayload);
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        userName.password
      );
      if (!validPassword) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Response.error(res, resPayload);
      }
      const token = jwt.sign({ _id: userName._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      let resPayload = {
        message: MESSAGE.LOGIN_SUCCESSFULLY,
        payload: { token: token },
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async profile(req, res) {
    try {
      const userId = req.userToken._id;
      const users = await user.findById(userId);
      let resPayload = {
        message: MESSAGE.PROFILE,
        payload: users,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async userUpdate(req, res) {
    try {
      if (req.body.password) {
        const password = await user.findOne({ _id: req.userToken._id });
        if (password.updatePassword === false) {
          let resPayload = {
            message: MESSAGE.PASSWORD_NOT_UPDATE,
          };
          return Response.error(res, resPayload);
        }
      }
      const userId = req.userToken._id;
      let email = await user
        .findOne({ email: req.body.email, _id: { $ne: userId } }).lean();
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIL_ERRROR,
        };
        return Response.error(res, resPayload);
      }
      const users = await user.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      let resPayload = {
        message: MESSAGE.PROFILE_UPDATED,
        payload: users,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async userDelete(req, res) {
    try {
      const userId = await user.findOne({ _id: req.userToken._id });
      if (userId.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_FOUND,
        };
        return Response.error(res, resPayload);
      }
      const deleteId = req.userToken._id;
      await user
        .findByIdAndUpdate(deleteId, { isDeleted: true })
        .then((value) => {
          let resPayload = {
            message: MESSAGE.USER_RECORD_DELETED,
            payload: value.details,
          };
          return Response.success(res, resPayload);
        });
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async addOrganization(req, res) {
    try {
      const idUser = req.userToken._id;
      const user_id = await user.findOne({ _id: req.userToken._id });

      if (user_id.isDeleted == true) {
        let resPayload = {
          message: MESSAGE.USER_NOT_FOUND,
        };
        return Response.error(res, resPayload);
      }
      const attribute = {
        orgName: req.body.orgName,
        userId: idUser,
        address: req.body.address,
      };
      const validation = joi.object({
        orgName: joi.string().required(),
        address: joi
          .object({
            address1: joi.string().required(),
            address2: joi.string().required(),
            city: joi.string().required(),
            state: joi.string().required(),
            country: joi.string().required(),
            zipCode: joi.number().required(),
          }).optional(),
      });
      const { error } = validation.validate(req.body, { abortEarly: false });
      if (error) {
        let Validation_error = error.details.map((err) => {
          let userError = {};
          Object.assign(userError, {
            message: err.message.replace(/[\,"]/g, " "),
            path: err.path.toString(),
          });
          return userError;
        });
        let payload = {
          message: MESSAGE.VALIDATION_ERROR,
          payload: Validation_error,
        };
        return Response.error(res, payload);
      }
      const orgs = await new organization(attribute);
      orgs.save();
      let resPayload = {
        message: MESSAGE.ORG_ADD_SUCCESSFULLY,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async organizationData(req, res) {
    try {
      const orgResult = await user.aggregate([
        {
          $lookup: {
            from: "organizations",
            localField: "_id",
            foreignField: "userId",
            as: "organization",
          },
        },
        {
          $project: {
            userName: 1,
            organization: {
              orgName: 1,
              address: {
                organization: 1,
                address1: 1,
                address2: 1,
                city: 1,
                state: 1,
                country: 1,
                zipCode: 1,
              },
            },
          },
        },
      ]);
      let resPayload = {
        message: MESSAGE.ORGANIZATION_LIST,
        payload: orgResult,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async organizationUpdate(req, res) {
    try {
      const idUser = req.userToken._id;
      const orgId = await organization.findById({ _id: req.params.id });
      if (orgId.userId != idUser) {
        let resPayload = {
          message: MESSAGE.NOT_UPDATE,
        };
        return Response.error(res, resPayload);
      }
      const validation = joi.object({
        orgName: joi.string().required(),
        address: joi
          .object({
            address1: joi.string().required(),
            address2: joi.string().required(),
            city: joi.string().required(),
            state: joi.string().required(),
            country: joi.string().required(),
            zipCode: joi.number().required(),
          }).optional(),
      });
      const { error } = validation.validate(req.body, { abortEarly: false });
      if (error) {
        let Validation_error = error.details.map((err) => {
          let userError = {};
          Object.assign(userError, {
            message: err.message.replace(/[\,"]/g, " "),
            path: err.path.toString(),
          });
          return userError;
        });
        let payload = {
          message: MESSAGE.VALIDATION_ERROR,
          payload: Validation_error,
        };
        return Response.error(res, payload);
      }
      const updateOrg = await organization.findByIdAndUpdate(orgId, req.body, {
        new: true,
      });
      let resPayload = {
        message: MESSAGE.ORGANIZATION_UPDATED,
        payload: updateOrg,
      };
      return Response.success(res, resPayload);
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
}
export default new UserController();
