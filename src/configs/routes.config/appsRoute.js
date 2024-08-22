import React from "react";
import { ADMIN_PREFIX_PATH } from "constants/route.constant";
import {
  ADMIN,
  SUPERADMIN,
  STAFF,
  STUDENT,
  INSTRUCTOR,
} from "constants/roles.constant";

const appsRoute = [
  {
    key: "apps.admin",
    path: `${ADMIN_PREFIX_PATH}/dashboard`,
    component: React.lazy(() => import("views/project/ProjectDashboard")),
    authority: [ADMIN, SUPERADMIN, STAFF, STUDENT, INSTRUCTOR],
  },
  {
    key: "apps.students",
    path: `${ADMIN_PREFIX_PATH}/students`,
    component: React.lazy(() => import("views/project/students")),
    authority: [ADMIN, SUPERADMIN, STAFF, STUDENT, INSTRUCTOR],
  },

];

export default appsRoute;
