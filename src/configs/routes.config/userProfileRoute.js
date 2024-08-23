import React from "react";
import { APP_PREFIX_PATH } from "constants/route.constant";
import {
  ADMIN,
  SUPERADMIN,
  STUDENT,
  INSTRUCTOR,
  STAFF,
} from "constants/roles.constant";

const userProfileRoute = [
  {
    key: "account.profile",
    path: `${APP_PREFIX_PATH}/account/profile`,
    component: React.lazy(() => import("views/account/profile")),
    authority: [ADMIN, SUPERADMIN, STUDENT, INSTRUCTOR, STAFF],
  },
];
export default userProfileRoute;
