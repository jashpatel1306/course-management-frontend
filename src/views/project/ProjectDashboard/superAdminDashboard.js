import React, { useEffect, useState } from "react";
import { Card } from "components/ui";
import {
  HiOutlineUserGroup,
  HiOutlineUserAdd,
  HiOutlineUsers
} from "react-icons/hi";
import { useSelector } from "react-redux";
import TopList from "./components/toplist";
import StudentRegistrations from "./components/studentRegistrations";
import axiosInstance from "apiServices/axiosInstance";
import ActiveUserAnalysis from "./components/activeUserChart";
import NumberFormat from "react-number-format";
import { getCurrentToPreviousYearDateRange } from "views/common/commonFuntion";


const StatisticCard = (props) => {
  const { label, value } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <Card className={`mb-3`}>
      <div className="flex justify-between items-center">
        <div className={`flex items-center gap-2 cursor-pointer`}>
          {/* <Avatar className={avatarClass} size={avatarSize} icon={icon} /> */}
          <div>
            <h6
              className={`font-bold text-lg text-${themeColor}-${primaryColorLevel} capitalize`}
            >
              {label}
            </h6>
            <h3
              className={`font-bold text-xl text-${themeColor}-${primaryColorLevel}`}
            >
              <NumberFormat
                displayType="text"
                value={value}
                thousandSeparator
              />
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SuperAdminDashboard = () => {
  const [apiFlag, setApiFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState();
  const [studentRegistrationsData, setStudentRegistrationsData] = useState();
  const [activeStudentsChartsData, setActiveStudentsChartsData] = useState();
  const [topCollegeData, setTopCollegeData] = useState();
  const [topCoursesData, setTopCoursesData] = useState();
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `admin/dashboard`,
        getCurrentToPreviousYearDateRange()
      );
      if (response.success) {
        setCountData(response.data?.countData);
        setStudentRegistrationsData(response.data?.studentRegistrationChart[0]);
        setActiveStudentsChartsData(response.data?.activeStudentsChart[0]);
        setTopCollegeData(
          response.data?.colleges.map((item) => {
            return {
              name: item.collegeName,
              avatar: item.avatar,
              url: `/app/admin/college-details/${item._id}`
            };
          })
        );
        setTopCoursesData(
          response.data?.courses.map((item) => {
            return {
              name: item.course,
              avatar: item.avatar,
              url: `/app/admin/content-hub/students/course-forms/${item._id}`
            };
          })
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("fetch sprint error: " + error);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      fetchDashboard();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <div>
      <div className="flex gap-4">
        <StatisticCard
          icon={<HiOutlineUserGroup />}
          label="Number of Students"
          value={countData?.students}
        />
        <StatisticCard
          icon={<HiOutlineUsers />}
          label="Number of Batches"
          value={countData?.batches}
        />
        <StatisticCard
          icon={<HiOutlineUserAdd />}
          label="Number of Instructors"
          value={countData?.instructors}
        />
        <StatisticCard
          icon={<HiOutlineUserGroup />}
          label="Number of Colleges"
          value={countData?.colleges}
        />
        <StatisticCard
          icon={<HiOutlineUserGroup />}
          label="Number of Courses"
          value={countData?.courses}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 mb-6 gap-4">
        <div className="col-span-1 ">
          {!loading && <TopList data={topCollegeData} title={"Top College"} />}
        </div>
        <div className="col-span-3  ">
          {!loading && <ActiveUserAnalysis data={activeStudentsChartsData} />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4  gap-4">
        <div className="col-span-3  ">
          {!loading && <StudentRegistrations data={studentRegistrationsData} />}
        </div>
        <div className="col-span-1 ">
          {!loading && <TopList data={topCoursesData} title={"Top Courses"} />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
