import { ADMIN_PREFIX_PATH } from "constants/route.constant";
import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM
} from "constants/navigation.constant";
import { ADMIN, SUPERADMIN, STAFF } from "constants/roles.constant";

const adminNavigationConfig = [
  {
    key: "apps.dashboard",
    path: `${ADMIN_PREFIX_PATH}/dashboard`,
    title: "Dashboard",
    icon: "dashboard",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: []
  },
  {
    key: "apps.students",
    path: `${ADMIN_PREFIX_PATH}/students`,
    title: "Students",
    icon: "student",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: []
  },
  {
    key: "apps.batches",
    path: `${ADMIN_PREFIX_PATH}/batches`,
    title: "Batches",
    icon: "batches",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, STAFF],
    subMenu: []
  },

  {
    key: "apps.contentHub",
    path: `${ADMIN_PREFIX_PATH}/content-hub`,
    title: "Content Hub",
    icon: "contentHub",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: [
      {
        key: "contentHub.students",
        path: `${ADMIN_PREFIX_PATH}/content-hub/students`,
        title: "Students Content",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN, STAFF],
        subMenu: []
      },
      {
        key: "contentHub.instructors",
        path: `${ADMIN_PREFIX_PATH}/content-hub/instructors`,
        title: "Instructors Content",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN, STAFF],
        subMenu: []
      },
      {
        key: "apps.assigncourses",
        path: `${ADMIN_PREFIX_PATH}/assign-courses`,
        title: "Assign Course",
        icon: "assign",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN, STAFF],
        subMenu: []
      }
    ]
  },

  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment`,
    title: "Assessment",
    icon: "assessment",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: [
      {
        key: "apps.assessment",
        path: `${ADMIN_PREFIX_PATH}/assessment`,
        title: "Assessment Content",
        icon: "assessment",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN, STAFF],
        subMenu: []
      },
      {
        key: "apps.assignassessmentcourses",
        path: `${ADMIN_PREFIX_PATH}/assign-assessment-courses`,
        title: "Assign Assessment Course",
        icon: "assign",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN, STAFF],
        subMenu: []
      }
    ]
  },
  {
    key: "apps.publiccontent",
    path: `${ADMIN_PREFIX_PATH}/public-content`,
    title: "Public Content",
    icon: "quiz",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [SUPERADMIN, STAFF],
    subMenu: [
      {
        key: "publiccontent.publicquizcontent",
        path: `${ADMIN_PREFIX_PATH}/public-content`,
        title: "Public Quiz Content",
        icon: "quiz",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPERADMIN, STAFF],
        subMenu: []
      },
      {
        key: "publiccontent.publiclink",
        path: `${ADMIN_PREFIX_PATH}/public-link`,
        title: "Public Link",
        icon: "quiz",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [SUPERADMIN, STAFF],
        subMenu: []
      }
    ]
  },
  {
    key: "apps.assessmentResult",
    path: `${ADMIN_PREFIX_PATH}/assessment-result`,
    title: "Assessment Result",
    icon: "result",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: []
  },
  {
    key: "apps.courseCompletionReport",
    path: `${ADMIN_PREFIX_PATH}/course-completion-report`,
    title: "Course Completion Report",
    icon: "report",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: []
  },
  {
    key: "apps.instructors",
    path: `${ADMIN_PREFIX_PATH}/instructors`,
    title: "Instructors",
    icon: "instructors",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: []
  },
  {
    key: "apps.colleges",
    path: `${ADMIN_PREFIX_PATH}/colleges`,
    title: "College/client",
    icon: "clients",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [SUPERADMIN, STAFF],
    subMenu: []
  },
  {
    key: "apps.staff",
    path: `${ADMIN_PREFIX_PATH}/staff`,
    title: "Staff",
    icon: "staff",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: []
  },

  {
    key: "apps.configuration",
    path: ``,
    title: "General Configuration",
    icon: "settings",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [ADMIN, SUPERADMIN, STAFF],
    subMenu: [
      {
        key: "configuration.departments",
        path: `${ADMIN_PREFIX_PATH}/configuration/departments`,
        title: "Departments",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, SUPERADMIN, STAFF],
        subMenu: []
      }
      // {
      //   key: "appconfigurations.policy",
      //   path: `${ADMIN_PREFIX_PATH}/configuration/policy`,
      //   title: "Policy",
      //   icon: "policy",
      //   type: NAV_ITEM_TYPE_ITEM,
      //   authority: [SUPERADMIN],
      //   subMenu: [],
      // },
    ]
  },
  {
    key: "apps.certificateTemplate",
    path: `${ADMIN_PREFIX_PATH}/certificate-template`,
    title: "Certificate  Template",
    icon: "certificate",
    type: NAV_ITEM_TYPE_ITEM,
    authority: [SUPERADMIN,STAFF],
    subMenu: []
  }
];

export default adminNavigationConfig;
