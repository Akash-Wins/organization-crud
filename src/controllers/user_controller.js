import user from "../models/user.js";
import MESSAGE from "../helpers/message.js";
import Response from "../helpers/response.js";
import organization from "../models/organization.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
  async addUser(req, res) {
    try {
      const check = await user.findOne({
        $or: [{ userName: req.body.userName }, { email: req.body.email }],
      });
      if (check) {
        let resPayload = {
          message: MESSAGE.INVALID_CREDENTIALS,
        };
        return Response.error(res, resPayload);
      }
      const users = new user(req.body);
      const idUser = users._id;
      if(req.body.orgnaization){
        const attribute = {
          orgName: req.body.organization.orgName,
          userId: idUser,
          address: req.body.organization.address,
        };
        const orgs = new organization(attribute);
        orgs.save();
      }
      users.save().then((value) => {
          const token = jwt.sign({ _id: value._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          let resPayload = {
            message: MESSAGE.REGISTER_SUCCESSFULLY,
            payload: { user: users, token: token },
          };
          return Response.success(res, resPayload);
        })
        .catch((err) => {
          let resPayload = {
            message: MESSAGE.REGISTER_FAILED,
          };
          return Response.error(res, resPayload);
        });
    } catch (err) {
      let resPayload = {
        message: MESSAGE.SERVER_ERROR,
      };
      return Response.error(res, resPayload);
    }
  }
  async login(req, res) {
    try {
      const userName = await user.findOne({ userName: req.body.userName });
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

      const validPassword = await bcrypt.compare(req.body.password,userName.password);
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
      const userId = req.userToken._id;
      let email = await user.findOne({ email: req.body.email, _id: { $ne: userId } }).lean();
      if (email) {
        let resPayload = {
          message: MESSAGE.EMAIL_ERROR,
        };
        return Response.error(res, resPayload);
      }
      if (!req.body.updatePassword) {
        delete req.body.password;
      }
      const users = await user.findByIdAndUpdate(userId, req.body, {new: true });
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
      await user.findByIdAndUpdate(deleteId, { isDeleted: true })
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
  
}
export default new UserController();
