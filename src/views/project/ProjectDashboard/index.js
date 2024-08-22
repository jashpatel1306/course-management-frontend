import React from "react";
import ClientDashboard from "./clientDashboard";
import InstructorsDashboard from "./instructorsDashboard";
import StaffDashboard from "./staffDashboard";
import SuperAdminDashboard from "./superAdminDashboard";
import StudentDashboard from "./studentDashboard";

const ProjectDashboard = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* <h1>Learning Management System</h1> */}
      <SuperAdminDashboard />
      {/* <ClientDashboard />
      <InstructorsDashboard />
      <StudentDashboard />
      <StaffDashboard /> */}
    </div>
  );
};

export default ProjectDashboard;
