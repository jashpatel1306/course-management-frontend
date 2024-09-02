import React from "react";
import { INSTRUCTOR_PREFIX_PATH } from "constants/route.constant";
import { INSTRUCTOR } from "constants/roles.constant";

const instructorRoute = [
  {
    key: "apps.instructor.dashboard",
    path: `${INSTRUCTOR_PREFIX_PATH}/dashboard`,
    component: React.lazy(() => import("views/instructorPanel/dashboard")),
    authority: [INSTRUCTOR],
  },
  {
    key: "apps.instructor.mycourses",
    path: `${INSTRUCTOR_PREFIX_PATH}/courses`,
    component: React.lazy(() => import("views/instructorPanel/myCourses")),
    authority: [INSTRUCTOR],
  },
  {
    key: "apps.instructor.assessment",
    path: `${INSTRUCTOR_PREFIX_PATH}/assessment`,
    component: React.lazy(() => import("views/instructorPanel/assessment")),
    authority: [INSTRUCTOR],
  },
];

export default instructorRoute;
