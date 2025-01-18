/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "apiServices/axiosInstance";
import {
  Button,
  Card,
  Dialog,
  Input,
  Spinner,
  Switcher,
  Upload
} from "components/ui";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaFile, FaPlus, FaFileAlt } from "react-icons/fa";
import {
  HiArrowNarrowLeft,
  HiOutlineCloudUpload,
  HiOutlinePencil
} from "react-icons/hi";
import { useSelector } from "react-redux";
import openNotification from "views/common/notification";
import DisplayError from "views/common/displayError";
import QuestionsList from "./questionList";
import QuestionForm from "./questionForm";
import { FormNumericInput } from "components/shared";
import { useNavigate, useParams } from "react-router-dom";
import { BiImport } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
const QuizCard = (props) => {
  const { quiz_id } = useParams();
  const navigate = useNavigate();

  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [formData, setFormData] = useState({
    title: "",
    description: [],
    time: null,
    isPublish: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [IsOpenQuiz, setIsOpenQuiz] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [questionData, setQuestionData] = useState();
  const [quizData, setQuizData] = useState();
  const [apiFlag, setApiFlag] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const [selectImportData, setSelectImportData] = useState({
    file: null
  });
  const [error, setError] = useState("");
  const beforeUpload = (files) => {
    let valid = true;

    const allowedFileType = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    const maxFileSize = 5000000;
    for (let file of files) {
      if (!allowedFileType.includes(file.type)) {
        valid = false;
      }
      if (file.size >= maxFileSize) {
        valid = false;
      }
    }
    if (valid) {
    }
    return valid;
  };
  const UpdateQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`user/public-quiz`, formData);
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        // setQuizData(response.data);
        setIsOpenQuiz(false);
        setApiFlag(true);
        setError("");
      } else {
        openNotification("danger", response.message);
      }
      setFormData({
        ...formData,
        title: "",
        description: [""],
        time: null,
        isPublish: false
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const onHandleQuizBox = async () => {
    try {
      if (!formData?.description?.length) {
        setError("Please Enter At Least One Instruction");
      }
      if (!formData?.time) {
        setError("Please Enter At Quiz Time In Minutes");
      }
      if (!formData?.title) {
        setError("Please Enter Quiz Title.");
      }
      if (formData?.title && formData?.time && formData?.description?.length) {
        UpdateQuiz();
        setApiFlag(true);
        setError("");
        setIsOpenQuiz(false);
        setFormData({
          ...formData,
          title: "",
          description: [""],
          time: null,
          isPublish: false,
          quizId: null
        });
      }
    } catch (error) {
      console.log("onHandleQuizBox error :", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`user/quiz/${quiz_id}`);
      if (response.success) {
        setQuizData(response.data);

        setSessionLoading(false);
      } else {
        openNotification("danger", response.message);
        setSessionLoading(false);
      }
    } catch (error) {
      console.log("get-all-batch error:", error);
      openNotification("danger", error.message);
      setSessionLoading(false);
    }
  };
  const ImportQuizData = async () => {
    try {
      setImportLoading(true);
      let apiData = {
        quizId: quiz_id,
        excelFile: selectImportData.file
      };
      const response = await axiosInstance.post(`user/question-bulk`, apiData);
      if (response.success) {
        openNotification("success", response.message);
      } else {
        openNotification("danger", response.message);
      }
      setSelectImportData({
        file: null
      });
    } catch (error) {
      console.log("onFormSubmit error: ", error);
      openNotification("danger", error.message);
    } finally {
      setImportLoading(false);
      setApiFlag(true);
      setIsOpen(false);
      setError("");
    }
  };
  const onHandleBox = async () => {
    try {
      if (!selectImportData?.file?.name) {
        setError("Please Select file.");
      }
      if (selectImportData?.file) {
        setError("");
        await ImportQuizData();
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setSessionLoading(true);
      fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      {sessionLoading && quizData && quizData?._id ? (
        <>
          <div className="flex justify-center">
            <Spinner size="3.25rem" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <div className="text-xl font-semibold text-center mr-4">
              <Button
                className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
                size="sm"
                icon={<HiArrowNarrowLeft size={30} />}
                onClick={async () => {
                  navigate("/app/admin/public-content");
                }}
              />
            </div>
            <h4
              className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
            >
              Quiz Content Details
            </h4>
          </div>
          <Card className="bg-gray-50 border-2 mb-3" bodyClass="p-3 sm:p-[1.25rem]">
            <div
              className={`flex flex-col md:flex-row justify-between items-start md:items-center text-lg font-semibold gap-2 text-${themeColor}-${primaryColorLevel} ${
                quizData?.questions?.length ? "mb-2" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle />

                <div>Quiz :</div>

                <FaFile />

                <div
                  className="flex capitalize gap-4 items-center"
                  onClick={() => {
                    setFormData({
                      title: quizData?.title,
                      description: quizData?.description,
                      time: quizData?.time,
                      isPublish: quizData?.isPublish,
                      quizId: quizData?._id
                    });
                    setIsOpenQuiz(true);
                  }}
                >
                  {quizData?.title}
                  <div>
                    <HiOutlinePencil />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="twoTone"
                  className={`border border-${themeColor}-${primaryColorLevel}`}
                  icon={<BiImport />}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Import Questions
                </Button>
                <div
                  className={`flex items-center text-base font-semibold text-${themeColor}-${primaryColorLevel} px-3 p-1 rounded-lg border border-${themeColor}-${primaryColorLevel}`}
                >
                  Total Marks : {quizData?.totalMarks || "0"}
                </div>
                <Button
                  className="mr-2"
                  size="sm"
                  icon={<FaPlus />}
                  onClick={() => {
                    setAddQuestion(true);
                  }}
                >
                  <span>Question</span>
                </Button>
              </div>
            </div>

            <div>
              {addQuestion ? (
                <QuestionForm
                  quizId={quizData?._id}
                  setAddQuestion={setAddQuestion}
                  questionData={questionData}
                  setApiFlag={setApiFlag}
                />
              ) : (
                <QuestionsList
                  quizData={quizData}
                  setAddQuestion={setAddQuestion}
                  setQuestionData={setQuestionData}
                  setApiFlag={setApiFlag}
                />
              )}
            </div>
          </Card>
        </>
      )}

      <Dialog
        isOpen={IsOpenQuiz}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpenQuiz(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: [""],
            quizId: null
          });
        }}
        onRequestClose={() => {
          setIsOpenQuiz(false);
          setError("");
          setFormData({
            ...formData,
            title: "",
            description: [""],
            quizId: null
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Quiz Details
          </h5>
          <div className="max-h-96 overflow-y-auto hidden-scroll">
            {/* Quiz Name  */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Quiz Title
              </div>
              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Please Enter Quiz Name"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value
                    });
                  }}
                  value={formData?.title}
                />
              </div>
            </div>
            {/* Quiz Time  */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Quiz Time (Minutes)
              </div>
              <div className="col-span-2">
                <FormNumericInput
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"]?.includes(evt.key) &&
                    evt.preventDefault()
                  }
                  placeholder="Please Enter Quiz Time"
                  className="capitalize"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      time: e.target.value
                    });
                  }}
                  value={formData?.time}
                />
              </div>
            </div>

            {/* Quiz Publish Status */}
            <div className="col-span-1 gap-4 mb-4">
              <div
                className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
              >
                Quiz Publish Status
              </div>
              <div className="col-span-2">
                <Switcher
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      isPublish: !e
                    });
                  }}
                  checked={formData?.isPublish}
                />
              </div>
            </div>
            {DisplayError(error)}
          </div>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setIsOpenQuiz(false);
              setError("");
              setFormData({
                ...formData,
                title: "",
                description: [],
                quizId: null
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleQuizBox} loading={isLoading}>
            Update
          </Button>
        </div>
      </Dialog>
      <Dialog
        isOpen={IsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setIsOpen(false);
          setError("");
          setSelectImportData({
            file: null
          });
        }}
        onRequestClose={() => {
          setIsOpen(false);
          setError("");
          setSelectImportData({
            file: null
          });
        }}
      >
        <div className="px-6 pb-4">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Import Questions
          </h5>

          <div className="col-span-1 gap-4 mb-2">
            <div className="col-span-2">
              {selectImportData?.file ? (
                <>
                  <div
                    className={`flex justify-between items-center text-base gap-2 p-3 bg-${themeColor}-100 rounded-lg font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                  >
                    <div className="flex gap-3 justify-between items-center">
                      <FaFileAlt size={20} />

                      {selectImportData?.file?.name}
                    </div>
                    <div
                      onClick={() => {
                        setSelectImportData({
                          ...selectImportData,
                          file: null
                        });
                      }}
                    >
                      <IoMdCloseCircle size={20} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Upload
                    showList={false}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    beforeUpload={beforeUpload}
                    onChange={async (file) => {
                      setSelectImportData({
                        ...selectImportData,
                        file: file[0]
                      });
                    }}
                  >
                    <Button
                      size="sm"
                      variant="twoTone"
                      icon={<HiOutlineCloudUpload size={20} />}
                    >
                      Upload Questions File
                    </Button>
                  </Upload>
                </>
              )}
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
          <Button variant="solid" onClick={onHandleBox} loading={importLoading}>
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default QuizCard;
