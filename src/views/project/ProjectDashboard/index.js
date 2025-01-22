import React from "react";
import SuperAdminDashboard from "./superAdminDashboard";
import ClientDashboard from "./clientDashboard";
import { useSelector } from "react-redux";
import {
  ADMIN,
  STAFF,
  STUDENT,
  INSTRUCTOR,
  SUPERADMIN
} from "constants/roles.constant";
import InstructorsDashboard from "views/instructorPanel/dashboard";
import StudentDashboard from "./studentDashboard";

const ProjectDashboard = () => {
  const userAuthority = useSelector(
    (state) => state.auth.user.userData.authority
  );
  const role = userAuthority[0];
  return (
    <div className="flex flex-col gap-4 h-full">
      {role === SUPERADMIN && <SuperAdminDashboard />}
      {role === STAFF && <SuperAdminDashboard />}
      {role === ADMIN && <ClientDashboard />}
      {role === INSTRUCTOR && <InstructorsDashboard />}
      {role === STUDENT && <StudentDashboard />}
    </div>
  );
};

export default ProjectDashboard;
