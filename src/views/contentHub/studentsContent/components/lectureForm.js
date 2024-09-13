import axiosInstance from "apiServices/axiosInstance";
import { Button, Dialog, Input, Switcher, Upload } from "components/ui";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaFile, FaFileAlt, FaVideo } from "react-icons/fa";
import { HiPlusCircle } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import ReactQuill, { Quill } from "react-quill";
import { useSelector } from "react-redux";
import DisplayError from "views/common/displayError";
import openNotification from "views/common/notification";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { FcImageFile } from "react-icons/fc";
Quill.register("modules/imageResize", ImageResize);
const modules = {
  toolbar: [
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["bold", "italic", "underline", "link", "image", "code"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
const LectureForm = (props) => {
  const { lectureIndex, lecture, sectionId, courseId } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [lectureOpen, setLectureOpen] = useState(false);
  const [lectureData, setLectureData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [apiFlag, setApiFlag] = useState(false);

  const [IsOpen, setIsOpen] = useState(false);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [error, setError] = useState("");
  const [lectureName, setLectureName] = useState(lecture?.name);
  const [lectureFormFlag, setLectureFormFlag] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    type: "",
    content: "",
    title: "",
  });
  // const [lectureFormFlag, setLectureFormFlag] = useState(false);
  const fetchLectureData = async () => {
    try {
      const response = await axiosInstance.get(`user/lecture/${lecture.id}`);
      if (response.success) {
        setLectureData(response.data);
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
  const UpdateLecture = async () => {
    try {
      setLectureLoading(true);

      const response = await axiosInstance.put(`user/lecture/${lecture.id}`, {
        name: lectureName,
        courseId: courseId,
        sectionId: sectionId,
      });
      if (response.success) {
        openNotification("success", response.message);
        setLectureData({
          ...lectureData,
          name: lectureName,
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
      setLectureLoading(false);
    }
  };
  const onHandleBox = async () => {
    try {
      if (!lectureName) {
        setError("Please Enter a section name");
      }
      if (lectureName && lectureName !== lecture.name) {
        setError("");
        await UpdateLecture();
      }
      if (lectureName && lecture.name === lectureName) {
        setIsOpen(false);
        setError("");
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  useEffect(() => {
    if (lectureOpen) {
      setIsLoading(true);
      fetchLectureData();
      setLectureForm({
        type: "",
        content: "",
        title: "",
      });
    }
  }, [lectureOpen]);
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchLectureData();
    }
  }, [apiFlag]);
  useEffect(() => {
    if (!lectureOpen) {
      setLectureForm({
        type: "",
        content: "",
        title: "",
      });
    }
  }, [lectureOpen]);
  const UpdateLectureContent = async () => {
    // try {
    //   setLectureLoading(true);
    //   const response = await axiosInstance.put(`user/lecture/${lecture.id}`, {
    //     content: quillRef.getEditor().root.innerHTML,
    //   });
    //   if (response.success) {
    //     openNotification("success", response.message);
    //   } else {
    //     openNotification("danger", response.message);
    //   }
    // } catch (error) {
    //   console.log("onFormSubmit error: ", error);
    //   openNotification("danger", error.message);
    // } finally {
    //   setLectureLoading(false);
    // }
  };
  const onHandleContentBox = async () => {
    try {
     
      if (!lectureForm.content) {
        setError("Please Enter a lecture Content");
      }
      if (!lectureForm.title) {
        setError("Please Enter a lecture Title");
      }
      if (lectureForm.title && lectureForm.content) {
        setError("");
        await UpdateLectureContent();
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  return (
    <>
      <div className="mt-6">
        <div className="mt-4  bg-gray-100 border-2 border-gray-300 rounded-lg">
          <div className="bg-white w-full rounded-lg ">
            <div
              className={`flex justify-between items-center text-lg font-semibold gap-2 px-3 p-3`}
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle />

                <div>Lecture {lectureIndex + 1} :</div>

                <FaFile />

                <div className="flex capitalize gap-4 items-center">
                  <div className="flex items-center gap-4 ">
                    <div
                      className="flex capitalize gap-4 items-center cursor-pointer"
                      onClick={() => {
                        setIsOpen(true);
                        setLectureName(lecture?.name);
                      }}
                    >
                      {lectureData?.name || lecture?.name}
                      <div>
                        <MdEdit />
                      </div>
                    </div>
                    <MdDelete />
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 ">
                <div className="flex items-center gap-3">
                  <div>{false ? "Publish" : "Unpublish"}</div>
                  <Switcher defaultChecked={false} />
                </div>
                <Button
                  size="sm"
                  variant="plain"
                  className={`text-base hover:bg-${themeColor}-100 bg-gray-50 border-2 border-gray-400 rounded-lg  `}
                  icon={<HiPlusCircle size={20} />}
                  onClick={() => {
                    setLectureForm({
                      type: "",
                      content: "",
                      title: "",
                    });
                    if (!lectureOpen) {
                      setLectureOpen(true);
                    }

                    setLectureFormFlag(true);
                  }}
                >
                  <span>Add Content</span>
                </Button>
                <IoIosArrowDown
                  className={`${lectureOpen ? "transform rotate-180" : ""}`}
                  size={25}
                  onClick={() => {
                    setLectureOpen(!lectureOpen);
                  }}
                />
              </div>
            </div>
            {lectureOpen ? (
              <>
                {lectureFormFlag ? (
                  <>
                    <div className="flex justify-center bg-gray-100 rounded-b-lg p-4 w-full">
                      {lectureForm.type ? (
                        <>
                          {lectureForm.type === "text" && (
                            <>
                              <div className="w-full  gap-y-4  items-center border-2 border-gray-300  py-4 px-4 bg-gray-200 rounded-lg">
                                <div className="col-span-1 gap-4 mb-4">
                                  <div
                                    className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                  >
                                    Article Title
                                  </div>
                                  <div className="col-span-2">
                                    <Input
                                      className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                                      placeholder="Article Title"
                                      value={lectureForm.title}
                                      onChange={(e) => {
                                        setLectureForm({
                                          ...lectureForm,
                                          title: e.target.value,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                >
                                  Article Content
                                </div>
                                <ReactQuill
                                  value={lectureForm?.content}
                                  onChange={(value) => {
                                    setLectureForm({
                                      ...lectureForm,
                                      content: value,
                                    });
                                  }}
                                  modules={modules}
                                  formats={formats}
                                  bounds={"#root"}
                                  theme="snow"
                                  placeholder="Add your content here..."
                                  className="bg-white"
                                />

                                <div className="flex justify-between my-2 mr-2">
                                  <div>{DisplayError(error)}</div>
                                  <Button
                                    variant="solid"
                                    onClick={onHandleContentBox}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}{" "}
                          {lectureForm.type === "video" && (
                            <>
                              <div className="w-full  gap-y-4  items-center border-2 border-gray-300  py-4 px-4 bg-gray-200 rounded-lg">
                                <div className="col-span-1 gap-4 mb-4">
                                  <div
                                    className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                  >
                                    Video Title
                                  </div>
                                  <div className="col-span-2">
                                    <Input
                                      className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                                      placeholder="Article Title"
                                      value={lectureForm.title}
                                      onChange={(e) => {
                                        setLectureForm({
                                          ...lectureForm,
                                          title: e.target.value,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                >
                                  Video Content
                                </div>
                                <div className="w-full bg-white rounded-lg">
                                  <Upload
                                    draggable
                                    showList={false}
                                    label="Video Upload"
                                    // beforeUpload={beforeUpload}
                                    onChange={(file) => {
                                      // setFormData({
                                      //   ...formData,
                                      //   coverImage: file[0],
                                      // });
                                      // setCoverImageUrl(
                                      //   URL.createObjectURL(file[0])
                                      // );
                                    }}
                                  >
                                    <div className="my-8 text-center">
                                      <div className="text-6xl w-full mb-4 flex justify-center">
                                        <FcImageFile />
                                      </div>
                                      <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                          Drop your Video here, or{" "}
                                        </span>
                                        <span
                                          className={`font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
                                        >
                                          browse
                                        </span>
                                      </p>
                                      <p className="mt-1 opacity-60 dark:text-white">
                                        Support: mp4, web
                                      </p>
                                    </div>
                                  </Upload>
                                </div>
                                <div className="flex justify-end my-2 mr-2">
                                  <Button variant="solid">Save</Button>
                                </div>
                              </div>
                            </>
                          )}
                          {lectureForm.type === "file" && (
                            <>
                              <div className="w-full  gap-y-4  items-center border-2 border-gray-300  py-4 px-4 bg-gray-200 rounded-lg">
                                <p className="text-gray-500 text-lg font-bold mb-2 ml-2">
                                  File Content
                                </p>
                                <div className="w-full bg-white rounded-lg">
                                  <Upload
                                    draggable
                                    showList={false}
                                    label="File Upload"
                                    // beforeUpload={beforeUpload}
                                    onChange={(file) => {
                                      // setFormData({
                                      //   ...formData,
                                      //   coverImage: file[0],
                                      // });
                                      // setCoverImageUrl(
                                      //   URL.createObjectURL(file[0])
                                      // );
                                    }}
                                  >
                                    <div className="my-8 text-center">
                                      <div className="text-6xl w-full mb-4 flex justify-center">
                                        <FcImageFile />
                                      </div>
                                      <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                          Drop your File here, or{" "}
                                        </span>
                                        <span
                                          className={`font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
                                        >
                                          browse
                                        </span>
                                      </p>
                                      <p className="mt-1 opacity-60 dark:text-white">
                                        Support: txt, pdf
                                      </p>
                                    </div>
                                  </Upload>
                                </div>
                                <div className="flex justify-end my-2 mr-2">
                                  <Button variant="solid">Save</Button>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-2/3 flex flex-col justify-center gap-y-4  items-center border-2 border-dashed border-gray-500  py-4 px-4 bg-gray-200 rounded-lg">
                            <p className="text-gray-500 text-lg">
                              Select the main type of content. Files and links
                              can be added as resources.
                            </p>
                            <div className="flex justify-center gap-4 ">
                              {/* Video Button */}
                              <div
                                className="border-2 border-gray-500 rounded-md flex flex-col items-center w-18 h-18 bg-white hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setLectureForm({
                                    ...lectureForm,
                                    type: "video",
                                  });
                                }}
                              >
                                <div className="flex-grow flex justify-center items-center p-3 px-4 ">
                                  <FaVideo size={25} />
                                </div>
                                <div className="bg-gray-400 w-full text-center py-1  text-white px-4 rounded-b-sm">
                                  Video
                                </div>
                              </div>

                              {/* Article Button */}
                              <div
                                className="border-2 border-gray-500 rounded-md flex flex-col items-center w-18 h-18 bg-white  hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setLectureForm({
                                    ...lectureForm,
                                    type: "text",
                                  });
                                }}
                              >
                                <div className="flex-grow flex justify-center items-center p-3 px-4 ">
                                  <RiArticleFill size={25} />
                                </div>
                                <div className="bg-gray-400 w-full text-center py-1 text-white px-4 rounded-b-sm">
                                  Article
                                </div>
                              </div>
                              {/* file Button */}
                              <div
                                className="border-2 border-gray-500 rounded-md flex flex-col items-center w-18 h-18 bg-white  hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setLectureForm({
                                    ...lectureForm,
                                    type: "file",
                                  });
                                }}
                              >
                                <div className="flex-grow flex justify-center items-center p-3 px-4 ">
                                  <FaFileAlt size={25} />
                                </div>
                                <div className="bg-gray-400  w-full text-center py-1 text-white px-6 rounded-b-sm">
                                  File
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center bg-gray-100 rounded-b-lg p-4 w-full">
                      <p>lecture content display</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
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
            Edit Lecture Details
          </h5>
          <div className="col-span-1 gap-4 mb-4">
            <div
              className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
            >
              Lecture Name
            </div>
            <div className="col-span-2">
              <Input
                className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                placeholder="Section Name"
                value={lectureName}
                onChange={(e) => {
                  setLectureName(e.target.value);
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
            loading={lectureLoading}
          >
            Submit
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default LectureForm;
