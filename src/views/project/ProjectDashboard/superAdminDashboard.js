import axiosInstance from "apiServices/axiosInstance";
import { Card } from "components/ui";
import { useEffect, useState } from "react";
import { FaBuilding, FaGraduationCap, FaUserTie } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { MdOutlineOndemandVideo } from "react-icons/md";
import NumberFormat from "react-number-format";
import { getCurrentToPreviousYearDateRange } from "views/common/commonFuntion";
import ActiveUserAnalysis from "./components/activeUserChart";
import StudentRegistrations from "./components/studentRegistrations";
import TopList from "./components/toplist";


const StatisticCard = (props) => {
  const { label, value, icon } = props;
  
  return (
    <Card className={`mb-3`}>
      <div className="flex justify-between items-center">
        <div className={`flex items-center justify-start gap-2 cursor-pointer`}>
          <div className={`flex items-center justify-center bg-gradient-to-br from-[#0DA9F0] to-[#0648BF] p-3 rounded-full`}>
            {icon && icon}
          </div>
          <div>
            <h6
              className={`text-sm md:text-base text-[#888888] font-normal capitalize`}
            >
              {label}
            </h6>
            <h3
              className={`font-bold text-2xl text-black`}
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
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4 gap-x-4 gap-y-0 mb-4">
        <StatisticCard
          icon={<FaGraduationCap className="w-6 h-6 text-white" />}
          label="Number of Students"
          value={countData?.students}
        />
        <StatisticCard
          icon={<IoPeople className="w-6 h-6 text-white" />}
          label="Number of Batches"
          value={countData?.batches}
        />
        <StatisticCard
          icon={<FaUserTie className="w-6 h-6 text-white" />}
          label="Number of Instructors"
          value={countData?.instructors}
        />
        <StatisticCard
          icon={<FaBuilding className="w-6 h-6 text-white" />}
          label="Number of Colleges"
          value={countData?.colleges}
          />
        <StatisticCard
          icon={<MdOutlineOndemandVideo className="w-6 h-6 text-white" />}
          label="Number of Courses"
          value={countData?.courses}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 mb-6 gap-y-4 lg:gap-4">
        <div className="col-span-3">
          {!loading && <ActiveUserAnalysis data={activeStudentsChartsData} />}
        </div>
        <div className="col-span-1 order-first lg:order-last">
          {!loading && <TopList data={topCollegeData} title={"Top College"} />}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4  gap-y-4 lg:gap-4">
        <div className="col-span-3  ">
          {!loading && <StudentRegistrations data={studentRegistrationsData} />}
        </div>
        <div className="col-span-1 order-first lg:order-last">
          {!loading && <TopList data={topCoursesData} title={"Top Courses"} />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
