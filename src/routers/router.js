import UserRoute from "./user";
import OrgRoute from "./organization";

const route = (app) => {
  
  UserRoute(app);
  OrgRoute(app);
};

export default route;