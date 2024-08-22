import React from "react";
import { Card, Avatar } from "components/ui";
import { MediaSkeleton, Loading } from "components/shared";
import {
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineUsers,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import WeeklyActivity from "./components/weeklyActivity";
import CourseStatistics from "./components/courseStatistics";
import TopTrainer from "./components/toptrainers";
import StudentRegistrations from "./components/studentRegistrations";

const StatisticCard = (props) => {
  const { icon, avatarClass, label, value, loading } = props;

  const avatarSize = 55;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <Card className={`bg-${themeColor}-${primaryColorLevel} w-64 h-25`}>
      <Loading
        loading={loading}
        customLoader={
          <MediaSkeleton
            avatarProps={{
              className: "rounded",
              width: avatarSize,
              height: avatarSize,
            }}
          />
        }
      >
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            {/* <Avatar className={avatarClass} size={avatarSize} icon={icon} /> */}
            <div>
              <span>{label}</span>
              <h3 className="text-white">{value}</h3>
            </div>
          </div>
        </div>
      </Loading>
    </Card>
  );
};

const weeklyReportData = [
  {
    name: "Active",
    data: [500, 350, 350, 450, 175, 375, 356],
  },
  {
    name: "Inactive",
    data: [230, 100, 259, 350, 247, 215, 380],
  },
];
const courseStatisticssData = [];
const SuperAdminDashboard = () => {
  return (
    <div>
      <h4 className="mb-4">My Cards</h4>
      <div className="flex gap-4 mb-6 overflow-x-auto whitespace-nowrap">
        <StatisticCard
          icon={<HiOutlineUserGroup />}
          label="Number of Students"
          value={5756}
        />
        <StatisticCard
          icon={<HiOutlineUsers />}
          label="Number of Batches"
          value={556}
        />
        <StatisticCard
          icon={<HiOutlineUserAdd />}
          label="Number of Trainer"
          value={56}
        />
        <StatisticCard
          icon={<HiOutlineUserGroup />}
          label="Number of Colleges"
          value={55}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeeklyActivity data={weeklyReportData} className="col-span-2" />
        <CourseStatistics data={courseStatisticssData} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4  gap-4 mt-8">
        <div className="col-span-1 ">
          <TopTrainer />
        </div>
        <div className="col-span-3 ">
          <StudentRegistrations />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
