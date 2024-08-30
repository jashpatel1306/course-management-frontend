import axiosInstance from "apiServices/axiosInstance";
import { Button, Card } from "components/ui";
import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import openNotification from "views/common/notification";

const BatchScroller = (props) => {
  const { flag } = props;
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [collegeData, setCollegeData] = useState(location.state);
  const [batchData, setBatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`admin/batches-option/${id}`);

      if (response.success) {
        response.data.shift();
        setBatchData(response.data);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-batch error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);
      fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  useEffect(() => {
    if (!flag) {
      setApiFlag(true);
    }
  }, [flag]);

  return (
    <>
      <Card>
      <div
                  className={`text-${themeColor}-${primaryColorLevel} text-base font-semibold capitalize`}
                >collegeNo : {collegeData.collegeNo}</div>
       <div
                  className={`text-${themeColor}-${primaryColorLevel} text-base font-semibold capitalize`}
                >collegeName : {collegeData.collegeName}</div>
      </Card>s
      <Card className="mt-6 relative rounded-lg">
        <div ref={containerRef} className="flex flex-wrap gap-4 pb-4">
          {!isLoading &&
            batchData?.map((item) => (
              <div
                key={item}
                className={` flex flex-start cursor-pointer shadow-lg justify-start gap-x-3 items-center p-2 px-4 border-2 border-${themeColor}-${primaryColorLevel} bg-${themeColor}-100 text-white rounded-xl`}
                onClick={() => {
                  navigate(`/app/admin/batche-details/${item._id}`);
                }}
              >
                <div
                  className={`bg-${themeColor}-${primaryColorLevel} text-base font-semibold rounded-full p-1 px-3`}
                >
                  Batch No : {item.batchNumber}
                </div>

                <div
                  className={`text-${themeColor}-${primaryColorLevel} text-base font-semibold capitalize`}
                >
                  Batch Name : {item.label}
                </div>
              </div>
            ))}
        </div>
      </Card>
    </>
  );
};

export default BatchScroller;
