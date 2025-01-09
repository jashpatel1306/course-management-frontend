import { Card } from "components/ui";
import React, { useEffect, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import UserBatchAnalysis from "./components/userBatchAnalysis";
import TopList from "./components/toplist";
import axiosInstance from "apiServices/axiosInstance";
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
              />{" "}
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};
const InstructorsDashboard = () => {
  const [apiFlag, setApiFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topBatcheData, setTopBatcheData] = useState([
    { name: "batch name", student: 120 }
  ]);
  const [userBatchChartsData, setUserBatchChartsData] = useState({
    monthsArray: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    valuesArray: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });
  // const fetchDashboard = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.post(
  //       `admin/dashboard`,
  //       getCurrentToPreviousYearDateRange()
  //     );
  //     if (response.success) {
  //       setUserBatchChartsData(response.data?.studentRegistrationChart[0]);
  //       setTopBatcheData(
  //         response.data?.colleges.map((item) => {
  //           return {
  //             name: item.collegeName,
  //             avatar: item.avatar,
  //             url: `/app/admin/college-details/${item._id}`
  //           };
  //         })
  //       );
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (apiFlag) {
  //     setApiFlag(false);
  //     fetchDashboard();
  //   }
  // }, [apiFlag]);
  // useEffect(() => {
  //   setApiFlag(true);
  // }, []);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 mb-6 gap-4">
        <div className="col-span-1 ">
          {!loading && <TopList data={topBatcheData} title={"Batches"} />}
        </div>
        <div className="col-span-3  ">
          {!loading && <UserBatchAnalysis data={userBatchChartsData} />}
        </div>
      </div>
    </div>
  );
};

export default InstructorsDashboard;
