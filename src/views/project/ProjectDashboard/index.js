import React from "react";
import SuperAdminDashboard from "./superAdminDashboard";
import ClientDashboard from "./clientDashboard";
import { useSelector } from "react-redux";
import { ADMIN, STAFF, STUDENT, SUPERADMIN } from "constants/roles.constant";

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
      {role === STUDENT && <ClientDashboard />}
    </div>
  );
};

export default ProjectDashboard;
