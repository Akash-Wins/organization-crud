import bodyparser from "express";
import UserController from "../controllers/user_controller";
import Middleware from "../middleware/auth_middleware";
import Validation from "../middleware/joi_middleware"

const route = (app) => {
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.post("/add/user",Validation.JoiMiddleware,UserController.addUser);
  app.post('/user/login',UserController.login);
  app.get('/user/profile',Middleware.authValidation,UserController.profile);
  app.put('/user/update',Validation.JoiMiddleware,Middleware.authValidation,UserController.userUpdate)
  app.delete('/user/delete',Middleware.authValidation,UserController.userDelete)
  app.post('/add/org',Middleware.authValidation,UserController.addOrganization)
  app.get('/user/orglist',UserController.organizationData)
  app.put('/user/orgupdate/:id',Middleware.authValidation,UserController.organizationUpdate)
};

export default route;