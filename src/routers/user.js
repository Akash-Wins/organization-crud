import UserController from "../controllers/user_controller";
import Middleware from "../middleware/auth_middleware";
import Validation from "../middleware/joi_middleware";

const UserRoute = (app) => {
  app.post("/add/user", Validation.JoiMiddleware, UserController.addUser);
  app.post("/user/login", UserController.login);
  app.get("/user/profile", Middleware.authValidation, UserController.profile);
  app.put(
    "/user/update",
    Validation.JoiMiddleware,
    Middleware.authValidation,
    UserController.userUpdate
  );
  app.delete(
    "/user/delete",
    Middleware.authValidation,
    UserController.userDelete
  );
};

export default UserRoute;
