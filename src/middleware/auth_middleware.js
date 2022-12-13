import Response from "../helpers/response.js";
import jwt from "jsonwebtoken";

class Middleware {
  authValidation(req, res, next) {
    const header = req.headers.authorization;
    const token = header.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userToken = decoded;
    } catch (err) {
      let resPayload = {
        message: err.message,
        payload: {},
      };
      return Response.error(res, resPayload, 401);
    }
    next();
  }
}

export default new Middleware();
