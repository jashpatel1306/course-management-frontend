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
    component: React.lazy(() => import("views/students")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.batches",
    path: `${ADMIN_PREFIX_PATH}/batches`,
    component: React.lazy(() => import("views/batches")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.batches.datails",
    path: `${ADMIN_PREFIX_PATH}/batche-details/:id`,
    component: React.lazy(() => import("views/batches/components/batchDetails")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.students",
    path: `${ADMIN_PREFIX_PATH}/students`,
    component: React.lazy(() => import("views/students")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "contentHub.students",
    path: `${ADMIN_PREFIX_PATH}/content-hub/students`,
    component: React.lazy(() => import("views/contentHub/studentsContent")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "contentHub.instructors",
    path: `${ADMIN_PREFIX_PATH}/content-hub/instructors`,
    component: React.lazy(() => import("views/contentHub/instructorsContent")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment`,
    component: React.lazy(() => import("views/assessment")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment/form/:assessmentId`,
    component: React.lazy(() => import("views/assessment/components/assessmentForm")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.instructors",
    path: `${ADMIN_PREFIX_PATH}/instructors`,
    component: React.lazy(() => import("views/instructors")),
    authority: [ADMIN, SUPERADMIN, STAFF],
  },
  {
    key: "apps.colleges",
    path: `${ADMIN_PREFIX_PATH}/colleges`,
    component: React.lazy(() => import("views/colleges")),
    authority: [SUPERADMIN],
  },
  {
    key: "apps.staff",
    path: `${ADMIN_PREFIX_PATH}/staff`,
    component: React.lazy(() => import("views/staff")),
    authority: [ADMIN, SUPERADMIN],
  },
  {
    key: "apps.policy",
    path: `${ADMIN_PREFIX_PATH}/policy`,
    component: React.lazy(() => import("views/policy")),
    authority: [ADMIN, SUPERADMIN],
  },
  {
    key: "apps.setting",
    path: `${ADMIN_PREFIX_PATH}/setting`,
    component: React.lazy(() => import("views/setting")),
    authority: [ADMIN, SUPERADMIN],
  },
];

export default appsRoute;
