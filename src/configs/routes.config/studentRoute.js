import React from "react";
import { STUDENT_PREFIX_PATH } from "constants/route.constant";
import { STUDENT } from "constants/roles.constant";

const studentRoute = [
  {
    key: "apps.student.dashboard",
    path: `${STUDENT_PREFIX_PATH}/dashboard`,
    component: React.lazy(() => import("views/studentPanel/dashboard")),
    authority: [STUDENT]
  },
  {
    key: "apps.student.mycourses",
    path: `${STUDENT_PREFIX_PATH}/courses`,
    component: React.lazy(() => import("views/studentPanel/myCourses")),
    authority: [STUDENT]
  },
  {
    key: "apps.student.assessment",
    path: `${STUDENT_PREFIX_PATH}/assessment`,
    component: React.lazy(() => import("views/studentPanel/assessment")),
    authority: [STUDENT]
  },
  {
    key: "apps.student.assessment",
    path: `${STUDENT_PREFIX_PATH}/assessment/:assessmentId`,
    component: React.lazy(() => import("views/studentPanel/assessmentView")),
    authority: [STUDENT]
  },
  {
    key: "apps.student.myquizattempts",
    path: `${STUDENT_PREFIX_PATH}/myquizattempts`,
    component: React.lazy(() => import("views/studentPanel/myquizattempts")),
    authority: [STUDENT]
  },
  {
    key: "apps.certificate",
    path: `${STUDENT_PREFIX_PATH}/certificate`,
    component: React.lazy(() => import("views/studentPanel/certificate")),
    authority: [STUDENT]
  },
  {
    key: "apps.quizattempts",
    path: `${STUDENT_PREFIX_PATH}/quiz-attempts`,
    component: React.lazy(() => import("views/studentPanel/quizAttempts")),
    authority: [STUDENT]
  },
  {
    key: "apps.certificate",
    path: `${STUDENT_PREFIX_PATH}/certificate/:certificateId`,
    component: React.lazy(() =>
      import("views/studentPanel/certificate/certificateView")
    ),
    authority: [STUDENT]
  }
];

export default studentRoute;
