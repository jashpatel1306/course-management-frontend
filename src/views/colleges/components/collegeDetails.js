import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Table } from "components/ui";
import React, { useRef, useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import {
  HiArrowNarrowLeft,
  HiOutlinePencil,
  HiPlusCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TableRowSkeleton } from "components/shared";
import { DataNoFound } from "assets/svg";
import BatchForm from "views/batches/components/batchForm";
const { Tr, Th, Td, THead, TBody } = Table;
const columns = [
  "Batch Number",
  "Batch Name",
  "Courses",
  "Instructor Name",
  "View",
];
const CollegeDetails = (props) => {
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
  const [batchesData, setBatchesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);
  const [addBatchFlag, setAddBatchFlag] = useState(false);
  const [batchData, setBatchData] = useState();
  const [collegeLoading, setCollegeLoading] = useState(false);
  const handleAddNewBatchClick = () => {
    setAddBatchFlag(true);
  };
  const handleAddNewBatchCloseClick = () => {
    setAddBatchFlag(false);
    setApiFlag(true);
  };
  const fetchCollegeData = async () => {
    try {
      const response = await axiosInstance.get(`admin/college/${id}`);
      if (response.success) {
        setCollegeData(response.data);
        setCollegeLoading(false);
      } else {
        openNotification("danger", response.message);
        setCollegeLoading(false);
      }
    } catch (error) {
      console.log("fetchCollegeData error:", error);
      openNotification("danger", error.message);
      setCollegeLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/batches/${id}`);

      if (response.success) {
        setBatchesData(response.data);
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
      if (!location.state) {
        fetchCollegeData();
      }
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
      <div className="flex items-center mb-4">
        <div className="text-xl font-semibold text-center mr-4">
          <Button
            className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
            size="sm"
            icon={<HiArrowNarrowLeft size={30} />}
            onClick={async () => {
              navigate("/app/admin/colleges");
            }}
          />
        </div>
        <h4
          className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
        >
          College Details
        </h4>
      </div>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-base font-semibold text-gray-700 ">
              College No:
            </span>
            <span
              className={`ml-2 text-${themeColor}-${primaryColorLevel} text-lg font-semibold`}
            >
              {collegeData?.collegeNo}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-base font-semibold text-gray-700">
              College Name:
            </span>
            <span
              className={`ml-2 text-${themeColor}-${primaryColorLevel} text-lg font-semibold`}
            >
              {collegeData?.collegeName}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-base font-semibold text-gray-700">
              Contact Person Name:
            </span>
            <span
              className={`ml-2 text-${themeColor}-${primaryColorLevel} text-lg font-semibold`}
            >
              {collegeData?.contactPersonName}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-base font-semibold text-gray-700">
              Contact Person No:
            </span>
            <span
              className={`ml-2 text-${themeColor}-${primaryColorLevel} text-lg font-semibold`}
            >
              {collegeData?.contactPersonNo}
            </span>
          </div>
        </div>
      </Card>

      <Card className="mt-6 relative rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Batches List
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewBatchCloseClick();
                //setSelectObject(item)
                setBatchData();
                setTimeout(() => {
                  handleAddNewBatchClick();
                }, 50);
              }}
            >
              Add New Batches
            </Button>
          </div>
        </div>
        <div ref={containerRef} className="">
          {isLoading ? (
            <>
              <Table>
                <THead>
                  <Tr>
                    {columns?.map((item) => {
                      return <Th key={item}>{item}</Th>;
                    })}
                  </Tr>
                </THead>
                <TableRowSkeleton columns={9} rows={10} />
              </Table>
            </>
          ) : batchesData && batchesData?.length ? (
            <>
              <Table>
                <THead>
                  <Tr>
                    {columns?.map((item) => {
                      return <Th key={item}>{item}</Th>;
                    })}
                  </Tr>
                </THead>
                <TBody>
                  {batchesData?.map((item, key) => {
                    return (
                      <Tr key={item?._id} className="capitalize">
                        <Td>{key + 1}</Td>
                        <Td>{item?.batchName}</Td>
                        <Td>
                          <p className="capitalize w-full max-w-lg">
                            {item.courses
                              .map((course) => course.courseName)
                              .join(", ")}
                          </p>
                        </Td>
                        <Td>
                          {" "}
                          {item.instructorIds
                            .map((instructor) => instructor.name)
                            .join(", ")}
                        </Td>

                        <Td>
                          <Button
                            shape="circle"
                            size="sm"
                            variant="twoTone"
                            className={`flex justify-center items-center gap-1 text-${themeColor}-${primaryColorLevel} border-2 font-semibold border-${themeColor}-${primaryColorLevel}`}
                            onClick={() => {
                              navigate(`/app/admin/batch-details/${item._id}`);
                            }}
                          >
                            View
                            <FaChevronRight size={15} />
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            </>
          ) : (
            <>
              <DataNoFound />
            </>
          )}
        </div>
      </Card>
      <BatchForm
        isOpen={addBatchFlag}
        handleCloseClick={handleAddNewBatchCloseClick}
        setBatchData={setBatchData}
        batchData={batchData}
        collegeId={id}
      />
    </>
  );
};

export default CollegeDetails;
