import { ADMIN_PREFIX_PATH } from "constants/route.constant";
import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "constants/navigation.constant";
import {
  ADMIN,
  SUPERADMIN,
  STAFF,
  STUDENT,
  INSTRUCTOR,
} from "constants/roles.constant";

const adminNavigationConfig = [
  {
    key: "apps.admin",
    path: `${ADMIN_PREFIX_PATH}/dashboard`,
    title: "Dashboard",
    icon: "dashboard",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STUDENT, INSTRUCTOR, STAFF],
    subMenu: [],
  },
  {
    key: "apps.students",
    path: `${ADMIN_PREFIX_PATH}/students`,
    title: "Students",
    icon: "student",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [],
  },

  {
    key: "apps.contentHub",
    path: `${ADMIN_PREFIX_PATH}/content-hub`,
    title: "Content Hub",
    icon: "contentHub",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [
      {
        key: "contentHub.students",
        path: `${ADMIN_PREFIX_PATH}/content-hub/students`,
        title: "Students",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN],
        subMenu: [],
      },
      {
        key: "contentHub.instructors",
        path: `${ADMIN_PREFIX_PATH}/content-hub/instructors`,
        title: "Instructors",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN],
        subMenu: [],
      },
    ],
  },
  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment`,
    title: "Assessment",
    icon: "assessment",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [],
  },
  {
    key: "contentHub.instructors",
    path: `${ADMIN_PREFIX_PATH}/content-hub/instructors`,
    title: "Instructors",
    icon: "instructors",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [],
  },
  {
    key: "apps.colleges",
    path: `${ADMIN_PREFIX_PATH}/colleges`,
    title: "College/client",
    icon: "clients",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [SUPERADMIN],
    subMenu: [],
  },
  {
    key: "apps.staff",
    path: `${ADMIN_PREFIX_PATH}/staff`,
    title: "Staff",
    icon: "staff",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [],
  },
  {
    key: "apps.policy",
    path: `${ADMIN_PREFIX_PATH}/policy`,
    title: "Policy",
    icon: "policy",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [],
  },
  {
    key: "apps.setting",
    path: `${ADMIN_PREFIX_PATH}/setting`,
    title: "Settings",
    icon: "settings",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN],
    subMenu: [],
  },
];

export default adminNavigationConfig;
