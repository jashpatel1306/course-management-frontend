import axiosInstance from "apiServices/axiosInstance";
import { Button, Card, Dialog, Input } from "components/ui";
import React, { useEffect, useState } from "react";
import { HiOutlinePencil, HiPlusCircle } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import openNotification from "views/common/notification";
import LectureForm from "./lectureForm";

const SectionForm = (props) => {
  const { sectionIndex, section, courseId } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [sectionOpenFlag, setSectionOpenFlag] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);

  const [IsOpen, setIsOpen] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [error, setError] = useState("");
  const [sectionName, setSectionName] = useState(section?.name);
  const fetchSectionData = async () => {
    try {
      const response = await axiosInstance.get(`user/section/${section.id}`);
      if (response.success) {
        setSectionData(response.data);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  const createLecture = async () => {
    try {
      setLectureLoading(true);
      const response = await axiosInstance.post(`user/Lecture`, {
        name: "New Lecture",
        sectionId: section.id,
        courseId: courseId,
      });
      if (response.success) {
        setApiFlag(true);
        openNotification("success", response.message);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("create-Lecture error:", error);
      openNotification("danger", error.message);
    } finally {
      setLectureLoading(false);
    }
  };
  const UpdateSection = async () => {
    try {
      setSectionLoading(true);

      const response = await axiosInstance.put(`user/section/${section.id}`, {
        name: sectionName,
        courseId: courseId,
      });
      if (response.success) {
        openNotification("success", response.message);
        setSectionData({
          ...sectionData,
          name: sectionName,
        });
        setIsOpen(false);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setSectionLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      if (!sectionName) {
        setError("Please Enter a section name");
      }
      if (sectionName && sectionName !== section.name) {
        setError("");
        await UpdateSection();
      }
      if (sectionName && section.name === sectionName) {
        setIsOpen(false);
        setError("");
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  useEffect(() => {
    if (sectionOpenFlag) {
      //   setApiFlag(false);
      setIsLoading(true);

      fetchSectionData();
    }
  }, [sectionOpenFlag]);
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);
      fetchSectionData();
    }
  }, [apiFlag]);

  return (
    <>
      <Card className="mt-4 bg-white" bodyClass="p-3 sm:p-[1.25rem]">
        <div
          className={`flex justify-between items-center text-${themeColor}-${primaryColorLevel} text-base sm:text-lg font-semibold `}
        >
          <div className="flex justify-start items-center gap-2 ">
            <div>
              <IoIosArrowDown
                className={`w-5 sm:w-6 h-5 sm:h-6 ${sectionOpenFlag ? "transform rotate-180" : ""}`}
                size={25}
                onClick={() => {
                  setSectionOpenFlag(!sectionOpenFlag);
                }}
              />
            </div>
            <div>Chapter {sectionIndex + 1} :</div>
            {/* <FaFile /> */}

            <div
              className="flex capitalize gap-4 items-center"
              onClick={() => {
                setIsOpen(true);
                setSectionName(section?.name);
              }}
            >
              {sectionData?.name || section?.name}
              <div>
                <HiOutlinePencil />
              </div>
            </div>
          </div>
        </div>
        <div className="md:px-10">
          {sectionOpenFlag ? (
            <>
              <div>
                {sectionData?.lectures?.length > 0 ? (
                  <>
                    {sectionData?.lectures?.map((info, index) => {
                      return (
                        <>
                          <LectureForm
                            lecture={info}
                            lectureIndex={index}
                            sectionId={section.id}
                            courseId={courseId}
                            setSectionData={setApiFlag}
                          />
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div
                className={`mt-4 text-${themeColor}-${primaryColorLevel} border-2 border-dashed border-gray-400 rounded-lg  bg-gray-50`}
              >
                <Button
                  size="md"
                  variant="plain"
                  block
                  className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
                  icon={<HiPlusCircle size={20} />}
                  loading={lectureLoading}
                  onClick={createLecture}
                >
                  <span>Add Lecture</span>
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </Card>
      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250,
          },
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Edit Section Details
          </h5>
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Section Name
            </div>
            <div className="col-span-2">
              <Input
                className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                placeholder="Section Name"
                value={sectionName}
                onChange={(e) => {
                  setSectionName(e.target.value);
                }}
              />
            </div>
          </div>

          {DisplayError(error)}
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpen(false);
              setError("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={onHandleBox}
            loading={sectionLoading}
          >
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default SectionForm;
