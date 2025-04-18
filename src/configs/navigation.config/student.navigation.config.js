import {
  ADMIN_PREFIX_PATH,
  STUDENT_PREFIX_PATH
} from "constants/route.constant";
import { NAV_ITEM_TYPE_ITEM } from "constants/navigation.constant";
import { STUDENT } from "constants/roles.constant";

const studentNavigationConfig = [
  // {
  //   key: "apps.student.dashboard",
  //   path: `${STUDENT_PREFIX_PATH}/dashboard`,
  //   title: "Dashboard",
  //   icon: "dashboard",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [STUDENT],
  //   subMenu: []
  // },
  {
    key: "apps.dashboard",
    path: `${ADMIN_PREFIX_PATH}/dashboard`,
    title: "Dashboard",
    icon: "dashboard",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: []
  },
  {
    key: "apps.student.mycourses",
    path: `${STUDENT_PREFIX_PATH}/courses`,
    title: "My Courses",
    icon: "student",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: []
  },
  {
    key: "apps.student.assessment",
    path: `${STUDENT_PREFIX_PATH}/assessment`,
    title: "Assessment",
    icon: "assessment",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: []
  },
  // {
  //   key: "apps.student.myquizattempts",
  //   path: `${STUDENT_PREFIX_PATH}/myquizattempts`,
  //   title: "My Quiz Attempts",
  //   icon: "attempts",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [STUDENT],
  //   subMenu: [],
  // },
  // {
  //   key: "apps.certificate",
  //   path: `${STUDENT_PREFIX_PATH}/certificate`,
  //   title: "Certificate",
  //   icon: "documentation",
  //   type: NAV_ITEM_TYPE_ITEM,
  //   authority: [STUDENT],
  //   subMenu: [],
  // },
  {
    key: "apps.quizattempts",
    path: `${STUDENT_PREFIX_PATH}/quiz-attempts`,
    title: "Quiz Attempts",
    icon: "documentation",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [STUDENT],
    subMenu: []
  }
];

export default studentNavigationConfig;
