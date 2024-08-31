import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Table } from "components/ui";
import React, { useRef, useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlinePencil, HiPlusCircle } from "react-icons/hi";
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
  // "Total Student",
  "Courses",
  "Instructor Name",
  // "Action",
  "View",
];
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
  const [batchesData, setBatchesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);
  const [addBatchFlag, setAddBatchFlag] = useState(false);
  const [batchData, setBatchData] = useState();

  const handleAddNewBatchClick = () => {
    setAddBatchFlag(true);
  };
  const handleAddNewBatchCloseClick = () => {
    setAddBatchFlag(false);
    setApiFlag(true);
  };
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/batches/${id}`);

      if (response.success) {
        response.data.shift();
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
        >
          collegeNo : {collegeData.collegeNo}
        </div>
        <div
          className={`text-${themeColor}-${primaryColorLevel} text-base font-semibold capitalize`}
        >
          collegeName : {collegeData.collegeName}
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
                      <Tr key={item?._id}>
                        <Td>{key + 1}</Td>
                        <Td>{item?.batchName}</Td>
                        <Td>python</Td>
                        <Td>{item?.instructorIds[0]?.toString()}</Td>

                        {/* <Td>
                          <div className=" flex gap-2 ">
                            <Button
                              shape="circle"
                              variant="solid"
                              size="sm"
                              icon={<HiOutlinePencil />}
                              onClick={async () => {
                                item.batchId = item._id;
                                // parentCloseCallback();
                                // setData(item);
                                setTimeout(() => {
                                  // parentCallback();
                                }, 100);
                              }}
                            />
                          </div>
                        </Td> */}
                        <Td>
                          <Button
                            shape="circle"
                            size="sm"
                            variant="twoTone"
                            className={`flex justify-center items-center gap-1 text-${themeColor}-${primaryColorLevel} border-2 font-semibold border-${themeColor}-${primaryColorLevel}`}
                            onClick={() => {
                              navigate(`/app/admin/batche-details/${item._id}`);
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

export default BatchScroller;
