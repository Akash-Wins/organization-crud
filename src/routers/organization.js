
import UserController from "../controllers/user_controller";
import Middleware from "../middleware/auth_middleware";
import Validation from "../middleware/joi_middleware"
import orgServices from "../controllers/org_controller";

const OrgRoute = (app) => {
    

  app.post('/add/org',Validation.JoiMiddleware,Middleware.authValidation,orgServices.addOrganization)
  app.get('/user/orglist',orgServices.organizationAllData)
  app.put('/user/orgupdate/:id',Validation.JoiMiddleware,Middleware.authValidation,orgServices.organizationUpdate)
}

export default OrgRoute