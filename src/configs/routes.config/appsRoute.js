import React from "react";
import {
  ADMIN_PREFIX_PATH,
  INSTRUCTOR_PREFIX_PATH,
  STUDENT_PREFIX_PATH
} from "constants/route.constant";
import {
  ADMIN,
  SUPERADMIN,
  STAFF,
  STUDENT,
  INSTRUCTOR
} from "constants/roles.constant";

const appsRoute = [
  {
    key: "apps.dashboard",
    path: `${ADMIN_PREFIX_PATH}/dashboard`,
    component: React.lazy(() => import("views/project/ProjectDashboard")),
    authority: [ADMIN, SUPERADMIN, STAFF, STUDENT, INSTRUCTOR]
  },
  {
    key: "apps.students",
    path: `${ADMIN_PREFIX_PATH}/students`,
    component: React.lazy(() => import("views/students")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.batches",
    path: `${ADMIN_PREFIX_PATH}/batches`,
    component: React.lazy(() => import("views/batches")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.batches.details",
    path: `${ADMIN_PREFIX_PATH}/batch-details/:id`,
    component: React.lazy(() =>
      import("views/batches/components/batchDetails")
    ),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },

  {
    key: "apps.students",
    path: `${ADMIN_PREFIX_PATH}/students`,
    component: React.lazy(() => import("views/students")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "contentHub.students",
    path: `${ADMIN_PREFIX_PATH}/content-hub/students`,
    component: React.lazy(() => import("views/contentHub/studentsContent")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "contentHub.students",
    path: `${ADMIN_PREFIX_PATH}/content-hub/students/course-forms/:course_id`,
    component: React.lazy(() =>
      import("views/contentHub/studentsContent/components/courseContentForm")
    ),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.previewCourse",
    path: `${ADMIN_PREFIX_PATH}/course/preview/:courseId`,
    component: React.lazy(() => import("views/previewCourses/students")),
    authority: [ADMIN, SUPERADMIN, STAFF],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  },
  {
    key: "apps.previewInstructorCourse",
    path: `${ADMIN_PREFIX_PATH}/course/instructor/preview/:courseId`,
    component: React.lazy(() => import("views/previewCourses/instructor")),
    authority: [ADMIN, SUPERADMIN, STAFF],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  },
  {
    key: "apps.viewCourse",
    path: `${STUDENT_PREFIX_PATH}/course/:courseId`,
    component: React.lazy(() =>
      import("views/studentPanel/myCourses/viewCourses")
    ),
    authority: [STUDENT],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  },
  {
    key: "apps.viewquiz",
    path: `${STUDENT_PREFIX_PATH}/:assessmentId/quiz/:quizId`,
    component: React.lazy(() => import("views/studentPanel/quiz")),
    authority: [STUDENT],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  },
  {
    key: "apps.viewquizresult",
    path: `${STUDENT_PREFIX_PATH}/quiz-result/:trackingId`,
    component: React.lazy(() => import("views/studentPanel/quizResult")),
    authority: [ADMIN, SUPERADMIN, STAFF, STUDENT],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  },

  {
    key: "contentHub.students",
    path: `${ADMIN_PREFIX_PATH}/content-hub/students/course/:course_id`,
    component: React.lazy(() =>
      import("views/contentHub/studentsContent/components/courseView")
    ),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "publiccontent.publicquizcontent",
    path: `${ADMIN_PREFIX_PATH}/public-content`,
    component: React.lazy(() =>
      import("views/publicContent/publicQuizContent")
    ),
    authority: [SUPERADMIN, STAFF]
  },
  {
    key: "publiccontent.publicquizcontent",
    path: `${ADMIN_PREFIX_PATH}/public-content/quiz-form/:quiz_id`,
    component: React.lazy(() =>
      import("views/publicContent/publicQuizContent/components/quizForm")
    ),
    authority: [SUPERADMIN, STAFF]
  },
  {
    key: "publiccontent.publicquizresult",
    path: `${ADMIN_PREFIX_PATH}/public-content/quiz-result/:quiz_id`,
    component: React.lazy(() =>
      import("views/publicContent/publicLink/components/publicResult")
    ),
    authority: [SUPERADMIN, STAFF]
  },
  {
    key: "publiccontent.publiclink",
    path: `${ADMIN_PREFIX_PATH}/public-link`,
    component: React.lazy(() => import("views/publicContent/publicLink")),
    authority: [SUPERADMIN, STAFF]
  },
  // {
  //   key: "apps.publicQuiz",
  //   path: `${QUIZ_PREFIX_PATH}/:quizId/public`,
  //   component: React.lazy(() => import("views/publicQuiz")),
  //   authority: [],
  //   meta: {
  //     layout: "blank",
  //     pageContainerType: "gutterless",
  //     footer: false
  //   }
  // },
  {
    key: "apps.assessmentResult",
    path: `${ADMIN_PREFIX_PATH}/assessment-result`,
    component: React.lazy(() => import("views/assessmentResult")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "contentHub.instructors",
    path: `${ADMIN_PREFIX_PATH}/content-hub/instructors`,
    component: React.lazy(() => import("views/contentHub/instructorsContent")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "contentHub.instructors",
    path: `${ADMIN_PREFIX_PATH}/content-hub/instructors/course-forms/:course_id`,
    component: React.lazy(() =>
      import("views/contentHub/instructorsContent/components/courseContentForm")
    ),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.viewInstructorsCourse",
    path: `${INSTRUCTOR_PREFIX_PATH}/course/:courseId`,
    component: React.lazy(() =>
      import("views/instructorPanel/myCourses/viewCourses")
    ),
    authority: [INSTRUCTOR],
    meta: {
      layout: "blank",
      pageContainerType: "gutterless",
      footer: false
    }
  },
  {
    key: "apps.assigncourses",
    path: `${ADMIN_PREFIX_PATH}/assign-courses`,
    component: React.lazy(() => import("views/contentHub/assignCourse")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment`,
    component: React.lazy(() => import("views/assessment")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.assignassessmentcourses",
    path: `${ADMIN_PREFIX_PATH}/assign-assessment-courses`,
    component: React.lazy(() => import("views/assignAssessmentCourse")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },

  {
    key: "apps.assessment",
    path: `${ADMIN_PREFIX_PATH}/assessment/form/:assessmentId`,
    component: React.lazy(() =>
      import("views/assessment/components/assessmentForm")
    ),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.instructors",
    path: `${ADMIN_PREFIX_PATH}/instructors`,
    component: React.lazy(() => import("views/instructors")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.colleges",
    path: `${ADMIN_PREFIX_PATH}/colleges`,
    component: React.lazy(() => import("views/colleges")),
    authority: [SUPERADMIN]
  },
  {
    key: "apps.college.datails",
    path: `${ADMIN_PREFIX_PATH}/college-details/:id`,
    component: React.lazy(() =>
      import("views/colleges/components/collegeDetails")
    ),
    authority: [SUPERADMIN, STAFF]
  },
  {
    key: "apps.staff",
    path: `${ADMIN_PREFIX_PATH}/staff`,
    component: React.lazy(() => import("views/staff")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.policy",
    path: `${ADMIN_PREFIX_PATH}/policy`,
    component: React.lazy(() => import("views/policy")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },

  {
    key: "configuration.departments",
    path: `${ADMIN_PREFIX_PATH}/configuration/departments`,
    component: React.lazy(() => import("views/configuration/departments")),
    authority: [ADMIN, SUPERADMIN, STAFF]
  },
  {
    key: "apps.certificateTemplate",
    path: `${ADMIN_PREFIX_PATH}/certificate-template`,
    component: React.lazy(() => import("views/certificateTemplate")),
    authority: [SUPERADMIN, ADMIN, STAFF]
  },

  {
    key: "apps.courseCompletionReport",
    path: `${ADMIN_PREFIX_PATH}/course-completion-report`,
    component: React.lazy(() => import("views/courseCompletionReport")),
    authority: [SUPERADMIN, ADMIN, STAFF]
  }
];

export default appsRoute;
