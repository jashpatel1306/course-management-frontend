import React from "react";
import { USER_PREFIX_PATH } from "constants/route.constant";
import { STUDENT } from "constants/roles.constant";

const studentRoute = [
  {
    key: "apps.student.mycourses",
    path: `${USER_PREFIX_PATH}/students`,
    component: React.lazy(() => import("views/studentPanel/myCourses")),
    authority: [STUDENT],
  },
  {
    key: "apps.student.assessment",
    path: `${USER_PREFIX_PATH}/assessment`,
    component: React.lazy(() => import("views/studentPanel/assessment")),
    authority: [STUDENT],
  },
  {
    key: "apps.certificate",
    path: `${USER_PREFIX_PATH}/certificate`,
    component: React.lazy(() => import("views/studentPanel/certificate")),
    authority: [STUDENT],
  },
];

export default studentRoute;
