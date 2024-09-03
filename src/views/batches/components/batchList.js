import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Table } from "components/ui";
import React, { useRef, useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import { useNavigate } from "react-router-dom";
import { TableRowSkeleton } from "components/shared";
import { DataNoFound } from "assets/svg";
const { Tr, Th, Td, THead, TBody } = Table;
const columns = [
  "Batch Number",
  "Batch Name",
  "Total Student",
  "Courses",
  "Instructor Name",
  "Action",
  "View",
];
const BatchList = (props) => {
  const { flag, parentCallback, setData, parentCloseCallback } = props;
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [batchData, setBatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [apiFlag, setApiFlag] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/batches/all`);
      if (response.success) {
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
      <Card className="mt-6 rounded-lg">
        {/* Batches container */}
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
          ) : batchData && batchData?.length ? (
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
                  {batchData?.map((item, key) => {
                    return (
                      <Tr key={item?._id} className="capitalize">
                        <Td>{key + 1}</Td>
                        <Td>{item?.batchName}</Td>
                        <Td>120</Td>
                        <Td>python</Td>
                        <Td>
                          {item.instructorIds?.map((instructor) => instructor.name)
                            .join(", ")}
                        </Td>

                        <Td>
                          <div className=" flex gap-2 ">
                            <Button
                              shape="circle"
                              variant="solid"
                              size="sm"
                              icon={<HiOutlinePencil />}
                              onClick={async () => {
                                item.batchId = item._id;
                                parentCloseCallback();
                                setData(item);
                                setTimeout(() => {
                                  parentCallback();
                                }, 100);
                              }}
                            />

                            {/* {item?.active && (
                              <Button
                                shape="circle"
                                color="red-700"
                                variant="solid"
                                size="sm"
                                icon={<HiOutlineTrash />}
                                onClick={() => {}}
                              />
                            )} */}
                          </div>
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
    </>
  );
};

export default BatchList;
