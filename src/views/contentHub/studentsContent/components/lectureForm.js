/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "apiServices/axiosInstance";
import {
  Button,
  Dialog,
  Input,
  Switcher,
  Upload,
  Table,
  Progress
} from "components/ui";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaEye,
  FaFile,
  FaFileAlt,
  FaVideo
} from "react-icons/fa";
import {
  HiOutlineMenu,
  HiOutlinePencil,
  HiOutlineTrash,
  HiPlusCircle,
  HiTrash
} from "react-icons/hi";
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
import FileUpload from "views/common/fileUpload";
import { useTable } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
const { Tr, Td, TBody } = Table;
Quill.register("modules/imageResize", ImageResize);
const modules = {
  toolbar: [
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ],
    ["bold", "italic", "underline", "link", "image", "code-block"]
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"]
  }
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
  "code",
  "code-block"
];
const CircleCustomInfo = ({ percent }) => {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <FaVideo size={30} />
      <h4>{percent.toFixed(0)}%</h4>
    </div>
  );
};
const ReactTable = ({ columns, data, lectureId, setApiFlag, isPublish }) => {
  const reorderData = async (startIndex, endIndex) => {
    if (!isPublish) {
      const newData = [...data];
      const [movedRow] = newData.splice(startIndex, 1);
      newData.splice(endIndex, 0, movedRow);
      const formData = {
        lectureContent: newData
      };
      const response = await axiosInstance.put(
        `user/lecture-content-drag-drop/${lectureId}`,
        formData
      );
      if (response?.success && response?.data?._id) {
        openNotification("success", response.message);
        setApiFlag(true);
      } else {
        openNotification("danger", response.message);
      }
    } else {
      openNotification(
        "warning",
        "Cannot reorder content while the lecture is published."
      );
    }
  };

  const table = useTable({ columns, data });

  const { getTableProps, prepareRow, rows } = table;

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderData(source.index, destination.index);
  };

  return (
    <Table {...getTableProps()} className="w-full  border-2 border-gray-200">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table-body">
          {(provided, _snapshot) => (
            <TBody ref={provided.innerRef} {...provided.droppableProps}>
              {rows.map((row, _index) => {
                prepareRow(row);
                return (
                  <Draggable
                    draggableId={row.original._id.toString()}
                    key={row.original._id}
                    index={row.index}
                  >
                    {(provided, snapshot) => {
                      const { style } = provided.draggableProps;

                      return (
                        <Tr
                          {...row.getRowProps()}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className={`${
                            snapshot.isDragging ? "table" : ""
                          } border-2  border-gray-20`}
                          style={style}
                        >
                          {row.cells.map((cell) => (
                            <Td
                              {...cell.getCellProps((_, meta) => {
                                return { ...meta?.cell.getCellProps() };
                              })}
                            >
                              {cell.render("Cell", {
                                dragHandleProps: provided.dragHandleProps
                              })}
                            </Td>
                          ))}
                        </Tr>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TBody>
          )}
        </Droppable>
      </DragDropContext>
    </Table>
  );
};
const LectureForm = (props) => {
  const { lectureIndex, lecture, sectionId, courseId, setSectionData } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [lectureOpen, setLectureOpen] = useState(false);
  const [lectureData, setLectureData] = useState([]);

  const [apiFlag, setApiFlag] = useState(false);

  const [IsOpen, setIsOpen] = useState(false);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [error, setError] = useState("");
  const [lectureName, setLectureName] = useState(lecture?.name);
  const [lectureFormFlag, setLectureFormFlag] = useState(false);
  const [file, setFile] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [lectureDeleteIsOpen, setLectureDeleteIsOpen] = useState(false);
  const [lecturePublishIsOpen, setLecturePublishIsOpen] = useState(false);
  const [lectureUnpublishIsOpen, setLectureUnpublishIsOpen] = useState(false);
  const [selectObject, setSelectObject] = useState();
  const [progress, setProgress] = useState(0); // State for progress
  const [lectureForm, setLectureForm] = useState({
    type: "",
    content: "",
    title: ""
  });
  // const [lectureFormFlag, setLectureFormFlag] = useState(false);
  const fetchLectureData = async () => {
    try {
      const response = await axiosInstance.get(`user/lecture/${lecture.id}`);
      if (response.success) {
        setLectureData(response.data);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message)
    }
  };
  const UpdateLecture = async () => {
    try {
      setLectureLoading(true);

      const response = await axiosInstance.put(`user/lecture/${lecture.id}`, {
        name: lectureName,
        courseId: courseId,
        sectionId: sectionId
      });
      if (response.success) {
        openNotification("success", response.message);
        setLectureData({
          ...lectureData,
          name: lectureName
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
      fetchLectureData();
      setLectureForm({
        type: "",
        content: "",
        title: ""
      });
    }
  }, [lectureOpen]);
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);

      fetchLectureData();
    }
  }, [apiFlag]);
  useEffect(() => {
    if (!lectureOpen) {
      setLectureForm({
        type: "",
        content: "",
        title: ""
      });
    }
  }, [lectureOpen]);
  const beforeUpload = (files) => {
    let valid = true;

    const allowedFileType = [
      // PDF
      "application/pdf",

      // Microsoft Office formats
      "application/vnd.ms-powerpoint", // PPT (old)
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX (new)
      "application/msword", // DOC (old)
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX (new)
      "application/vnd.ms-excel", // XLS (old)
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // XLSX (new)
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
  const beforeVideoUpload = (files) => {
    let valid = true;

    const allowedFileType = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "video/x-flv",
      "video/x-matroska",
      "video/3gpp"
    ];
    const maxFileSize = 1073741824;
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
  const UpdateLectureContent = async (formData) => {
    try {
      setLectureLoading(true);
      const response = await axiosInstance.put(
        `user/lecture-content/${lecture.id}`,
        formData
      );
      if (response.success) {
        openNotification("success", response.message);
        setLectureForm({
          type: "",
          content: "",
          title: ""
        });
        setLectureFormFlag(false);
        setApiFlag(true);
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
  const startUpload = async (file) => {
    const data = await axiosInstance.post("user/start-upload", {
      filename: file.name,
      filetype: file.type
    });
    return { uploadId: data.uploadId, key: data.key };
  };
  const uploadPart = async (uploadId, key, partNumber, part) => {
    const formData = {
      uploadId: uploadId,
      key: key,
      partNumber: partNumber,
      part: part
    };

    const data = await axiosInstance.post("user/upload-part", formData);
    return data;
  };
  const completeUpload = async (uploadId, key, parts) => {
    const finalParts = parts.map((response, index) => ({
      ETag: response.ETag,
      PartNumber: index + 1
    }));

    const res = await axiosInstance.post("user/complete-upload", {
      uploadId,
      key,
      parts: finalParts
    });

    return res.fileUrl;
  };

  const VideoUpload = async (file) => {
    setVideoLoading(true);
    const startUploadResult = await startUpload(file);
    if (startUploadResult.uploadId && startUploadResult.key) {
      const chunkSize = 5 * 1024 * 1024; // 5 MB
      const parts = [];
      const totalParts = Math.ceil(file.size / chunkSize); // Total number of parts
      let start = 0;
      let completedParts = 0; // Track the number of completed parts

      while (start < file.size) {
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        const partNumber = parts.length + 1;

        // Upload part
        const response = await uploadPart(
          startUploadResult.uploadId,
          startUploadResult.key,
          partNumber,
          chunk
        );
        parts.push(response);
        completedParts++;

        // Update progress
        setProgress((completedParts / totalParts) * 100);

        start = end;
      }

      // Ensure that the last part is correctly handled even if it is smaller than the chunk size
      if (parts.length > 0) {
        const resResult = await completeUpload(
          startUploadResult.uploadId,
          startUploadResult.key,
          parts
        );
        setVideoLoading(false);
        return resResult;
      } else {
        throw new Error("No parts were uploaded.");
      }
    } else {
      return "";
    }
  };
  const onHandleContentBox = async () => {
    try {
      if (lectureForm.type === "text") {
        if (!lectureForm.content) {
          setError("Please Enter a Content");
        }
        if (!lectureForm.title) {
          setError("Please Enter a Content Title");
        }
        if (lectureForm.title && lectureForm.content) {
          setError("");
          await UpdateLectureContent(lectureForm);
        }
      }
      if (lectureForm.type === "file") {
        if (!lectureForm.content && !file) {
          setError("Please Upload a Content file");
        }

        if (!lectureForm.title) {
          setError("Please Enter a Content Title");
        }
        if (lectureForm.title && file) {
          const filePath = await FileUpload(file, "content/files");
          if (filePath.status) {
            await UpdateLectureContent({
              type: "file",
              content: filePath.data,
              title: lectureForm.title
              // id: lectureForm.id ? lectureForm.id : "",
            });
            setFile(null);
          } else {
            setError(filePath.message);
          }
        } else {
          if (lectureForm.title && lectureForm.content) {
            await UpdateLectureContent({
              type: "video",
              content: lectureForm.content,
              title: lectureForm.title
              // id: lectureForm.id ? lectureForm.id : "",
            });
            setFile(null);
          }
        }
      }
      if (lectureForm.type === "video") {
        if (!lectureForm.content && !file) {
          setError("Please Upload a Video file");
        }

        if (!lectureForm.title) {
          setError("Please Enter a Video Title");
        }
        if (lectureForm.title && file) {
          const filePath = await VideoUpload(file);
          if (filePath) {
            await UpdateLectureContent({
              type: "video",
              content: filePath,
              title: lectureForm.title
              // id: lectureForm.id ? lectureForm.id : "",
            });
            setFile(null);
          } else {
            setError(filePath);
          }
        } else {
          if (lectureForm.title && lectureForm.content) {
            await UpdateLectureContent({
              type: "file",
              content: lectureForm.content,
              title: lectureForm.title
              // id: lectureForm.id ? lectureForm.id : "",
            });
            setFile(null);
            setError("");
          }
        }
      }
    } catch (error) {
      console.log("onHandleBox error :", error);
    }
  };
  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "title",
        Cell: (props) => {
          return (
            <>
              <>
                <div className=" flex gap-4 items-center rounded-lg">
                  <p className=" text-base font-bold">
                    {props.row.original.type === "video" ? (
                      <FaVideo size={20} />
                    ) : props.row.original.type === "text" ? (
                      <RiArticleFill size={20} />
                    ) : (
                      <FaFileAlt size={20} />
                    )}{" "}
                  </p>
                  <p className="text-gray-500 text-sm sm:text-base font-bold">
                    {props.value}
                  </p>
                </div>
              </>
            </>
          );
        }
      },
      {
        id: "dragger",
        Header: "",
        accessor: (row) => row,
        Cell: (props) => (
          <>
            <div
              className={`flex gap-4 justify-end text-gray-${primaryColorLevel}`}
            >
              <span
                onClick={() => {
                  setLectureFormFlag(true);
                  setLectureForm({
                    type: props?.row?.original?.type,
                    content: props?.row?.original?.content,
                    title: props?.row?.original?.title,
                    id: props?.row?.original?._id
                  });
                }}
              >
                <HiOutlinePencil size={20} />
              </span>
              <span
                onClick={() => {
                  setDeleteIsOpen(true);
                  setSelectObject(props.row.original);
                }}
              >
                <HiOutlineTrash size={20} />
              </span>

              <span {...props.dragHandleProps}>
                <HiOutlineMenu size={20} />
              </span>
            </div>
          </>
        )
      }
    ],
    []
  );
  const onHandleLectureDeleteBox = async () => {
    try {
      const response = await axiosInstance.delete(`user/lecture/${lecture.id}`);
      if (response.success) {
        openNotification("success", response.message);
        setSectionData(true);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onHandleLectureDeleteBox error:", error);
      openNotification("danger", error.message);
    } finally {
      setLectureDeleteIsOpen(false);
    }
  };
  const onHandleLecturePublishBox = async () => {
    try {
      const response = await axiosInstance.put(
        `user/lecture/publish/${lecture.id}`
      );
      if (response.success) {
        openNotification("success", response.message);
        setApiFlag(true);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onHandleLecturePublishBox error:", error);
      openNotification("danger", error.message);
    } finally {
      setLecturePublishIsOpen(false);
      setLectureUnpublishIsOpen(false);
    }
  };
  const onHandleLectureUnpublishBox = async () => {
    try {
      const response = await axiosInstance.put(
        `user/lecture/unpublish/${lecture.id}`
      );
      if (response.success) {
        openNotification("success", response.message);
        setApiFlag(true);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onHandleLecturePublishBox error:", error);
      openNotification("danger", error.message);
    } finally {
      setLecturePublishIsOpen(false);
      setLectureUnpublishIsOpen(false);
    }
  };
  const onHandleLectureContentDeleteBox = async () => {
    try {
      const response = await axiosInstance.delete(
        `user/lecture-content/${lecture.id}/${selectObject._id}`
      );
      if (response.success) {
        openNotification("success", response.message);
        setApiFlag(true);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.log("onHandleLectureContentDeleteBox error:", error);
      openNotification("danger", error.message);
    } finally {
      setDeleteIsOpen(false);
    }
  };
  return (
    <>
      <div className="mt-6">
        <div className="mt-4  bg-gray-100 border-2 border-gray-300 rounded-lg">
          <div className="bg-white w-full rounded-lg ">
            <div
              className={`flex flex-col lg:flex-row justify-between items-center text-sm md:text-base md:text-lg font-semibold gap-2 px-3 p-2 md:p-3`}
            >
              <div className="w-full lg:w-auto flex items-center gap-2">
                <FaCheckCircle />

                <div>Unit {lectureIndex + 1} :</div>

                <FaFile />

                <div className="flex capitalize gap-2 md:gap-4 items-center">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div
                      className="flex items-center capitalize gap-4 cursor-pointer"
                      onClick={() => {
                        setIsOpen(true);
                        setLectureName(lecture?.name);
                      }}
                    >
                      {lectureData?.name || lecture?.name}
                      <div>
                        <MdEdit size={20} />
                      </div>
                    </div>
                    <MdDelete
                      size={20}
                      className=" cursor-pointer"
                      onClick={() => {
                        setLectureDeleteIsOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto flex justify-between lg:justify-center items-center gap-4 ">
                <Button
                  size="sm"
                  variant="plain"
                  className={`text-sm sm:text-base hover:bg-${themeColor}-100 bg-gray-50 border-2 border-gray-400 rounded-lg  `}
                  icon={<HiPlusCircle size={20} />}
                  onClick={() => {
                    setLectureForm({
                      type: "",
                      content: "",
                      title: ""
                    });
                    if (!lectureOpen) {
                      setLectureOpen(true);
                    }

                    setLectureFormFlag(true);
                  }}
                  disabled={lectureData.isPublish}
                >
                  <span>Add Content</span>
                </Button>
                <IoIosArrowDown
                  className={`${lectureOpen ? "transform rotate-180" : ""}`}
                  size={25}
                  onClick={() => {
                    setLectureOpen(!lectureOpen);
                    setLectureFormFlag(false);
                  }}
                />
              </div>
            </div>
            {lectureOpen ? (
              <>
                {lectureFormFlag ? (
                  <>
                    <div className="flex justify-center bg-gray-100 rounded-b-lg p-2 md:p-4 w-full">
                      {lectureForm.type ? (
                        <>
                          {lectureForm.type === "text" && (
                            <>
                              <div className="w-full gap-y-4 items-center border-2 border-gray-300 p-2 md:p-4 bg-gray-200 rounded-lg">
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
                                          title: e.target.value
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
                                      content: value
                                    });
                                  }}
                                  modules={modules}
                                  formats={formats}
                                  // bounds={"#editer"}
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
                                      placeholder="Video Title"
                                      value={lectureForm.title}
                                      onChange={(e) => {
                                        setLectureForm({
                                          ...lectureForm,
                                          title: e.target.value
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                                {lectureForm.content ? (
                                  <>
                                    <div className="flex flex-wrap items-center justify-start mb-4">
                                      <div className="group relative p-4 rounded flex h-32 ">
                                        {/* <img
                                          
                                          src={lectureForm.content}
                                          alt={lectureForm.content}
                                        /> */}
                                        <FaVideo className="h-28 w-full rounded" />
                                        <div className="h-32 w-full rounded absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                                          <span
                                            onClick={() => {
                                              setLectureForm({
                                                ...lectureForm,
                                                content: ""
                                              });
                                            }}
                                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                                          >
                                            <HiTrash />
                                          </span>
                                          <span
                                            onClick={() => {
                                              window.open(
                                                lectureForm.content,
                                                "_blank"
                                              );
                                            }}
                                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                                          >
                                            <FaEye />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    {videoLoading ? (
                                      <>
                                        <div className="flex justify-center items-center">
                                          <div>
                                            <Progress
                                              variant="circle"
                                              percent={progress}
                                              width={100}
                                              className="flex justify-between items-center"
                                              customInfo={
                                                <CircleCustomInfo
                                                  percent={progress}
                                                />
                                              }
                                            />
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div>
                                        <div
                                          className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                        >
                                          Video Content
                                        </div>
                                        <div className="w-full rounded-lg">
                                          <Upload
                                            draggable
                                            showList={true}
                                            label="Video Upload"
                                            beforeUpload={beforeVideoUpload}
                                            className="bg-white"
                                            onChange={(file) => {
                                              setFile(file[0]);
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
                                      </div>
                                    )}
                                  </>
                                )}
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
                          )}
                          {lectureForm.type === "file" && (
                            <>
                              <div className="w-full  gap-y-4  items-center border-2 border-gray-300  py-4 px-4 bg-gray-200 rounded-lg">
                                <div className="col-span-1 gap-4 mb-4">
                                  <div
                                    className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                  >
                                    File Title
                                  </div>
                                  <div className="col-span-2">
                                    <Input
                                      className="w-[100%] md:mb-0 mb-4 sm:mb-0"
                                      placeholder="File Title"
                                      value={lectureForm.title}
                                      onChange={(e) => {
                                        setLectureForm({
                                          ...lectureForm,
                                          type: "file",
                                          title: e.target.value
                                        });
                                      }}
                                    />
                                  </div>
                                </div>

                                {lectureForm.content ? (
                                  <>
                                    <div className="flex flex-wrap items-center justify-start mb-4">
                                      <div className="group relative p-2 rounded flex h-32 ">
                                        <FaFileAlt className="h-32 w-full rounded" />
                                        <div className="h-32 w-full rounded absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                                          <span
                                            onClick={() => {
                                              setLectureForm({
                                                ...lectureForm,
                                                content: ""
                                              });
                                            }}
                                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                                          >
                                            <HiTrash />
                                          </span>
                                          <span
                                            onClick={() => {
                                              window.open(
                                                lectureForm.content,
                                                "_blank"
                                              );
                                            }}
                                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                                          >
                                            <FaEye />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                                    >
                                      File Content
                                    </div>
                                    <div className="w-full rounded-lg">
                                      <Upload
                                        draggable
                                        showList={true}
                                        label="File Upload"
                                        beforeUpload={beforeUpload}
                                        className="bg-white"
                                        onChange={(file) => {
                                          setFile(file[0]);
                                        }}
                                      >
                                        <div className="w-full my-8 text-center ">
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
                                            Support: PDF, PPTX, DOC, DOCX, XLS,
                                            XLSX
                                          </p>
                                        </div>
                                      </Upload>
                                    </div>
                                  </>
                                )}

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
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-2/3 flex flex-col justify-center gap-y-4 items-center border-2 border-dashed border-gray-500  py-4 px-4 bg-gray-200 rounded-lg">
                            <p className="text-gray-500 text-sm sm:text-lg">
                              Select the main type of content. Files and links
                              can be added as resources.
                            </p>
                            <div className="flex justify-center gap-4 ">
                              {/* Video Button */}
                              <div
                                className="border-2 border-gray-500 rounded-md flex flex-col items-center w-18 h-18 bg-white hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setProgress(0);
                                  setVideoLoading(false);
                                  setFile(null);
                                  setLectureForm({
                                    ...lectureForm,
                                    type: "video"
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
                                    type: "text"
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
                                    type: "file"
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
                    <div className="flex flex-col justify-center bg-gray-100 rounded-b-lg p-2 md:p-4 w-full">
                      <div className="flex justify-end mb-4 items-center gap-3 ">
                        {lectureData?.lectureContent?.length > 0 && (
                          <div className="flex justify-center items-center gap-4 bg-gray-300 p-2 px-4  rounded-lg">
                            {lectureData.isPublish ? (
                              <>
                                <div
                                  className={`text-sm sm:text-lg text-${themeColor}-${primaryColorLevel} font-semibold`}
                                >
                                  Publish
                                </div>
                                <Switcher
                                  defaultChecked={false}
                                  color="blue-500"
                                  checked={lectureData.isPublish}
                                  onChange={(val) => {
                                    console.log("val: ", val);
                                    if (val) {
                                      setLectureUnpublishIsOpen(true);
                                      setLecturePublishIsOpen(false);
                                    }
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <div
                                  className={`text-lg ${
                                    lectureData.isPublish
                                      ? `text-${primaryColorLevel}-${themeColor}`
                                      : " text-gray-500"
                                  } font-semibold`}
                                >
                                  Unpublish
                                </div>
                                <Switcher
                                  defaultChecked={false}
                                  color="blue-500"
                                  checked={lectureData.isPublish}
                                  onChange={(val) => {
                                    if (!val) {
                                      setLecturePublishIsOpen(true);
                                      setLectureUnpublishIsOpen(false);
                                    }
                                  }}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {lectureData?.lectureContent?.length > 0 ? (
                        <>
                          <ReactTable
                            columns={columns}
                            // onChange={(newList) => setData(newList)}
                            data={lectureData?.lectureContent}
                            lectureId={lectureData?._id}
                            isPublish={lectureData?.isPublish}
                            setApiFlag={setApiFlag}
                          />
                        </>
                      ) : (
                        <>
                          {" "}
                          <p className="flex justify-center items-center font-semibold text-base sm:text-lg">
                            No Content Available
                          </p>
                        </>
                      )}
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
            marginTop: 250
          }
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
      <Dialog
        isOpen={deleteIsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setDeleteIsOpen(false);
          // setApiFlag(true);
        }}
        onRequestClose={() => {
          setDeleteIsOpen(false);
          // setApiFlag(true);
        }}
      >
        <div className="px-6 pb-6">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Confirm Delete of Lecture Content
          </h5>
          <p>Are you sure you want to delete this Lecture Content?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setDeleteIsOpen(false);
              // setApiFlag(true);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleLectureContentDeleteBox}>
            Okay
          </Button>
        </div>
      </Dialog>
      <Dialog
        isOpen={lectureDeleteIsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setLectureDeleteIsOpen(false);
          // setApiFlag(true);
        }}
        onRequestClose={() => {
          setLectureDeleteIsOpen(false);
          // setApiFlag(true);
        }}
      >
        <div className="px-6 pb-6">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Confirm Delete of Lecture
          </h5>
          <p>Are you sure you want to delete this permanently Lecture?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setLectureDeleteIsOpen(false);
              // setApiFlag(true);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleLectureDeleteBox}>
            Okay
          </Button>
        </div>
      </Dialog>
      <Dialog
        isOpen={lecturePublishIsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          lectureUnpublishIsOpen(false);
          setLecturePublishIsOpen(false);
        }}
        onRequestClose={() => {
          lectureUnpublishIsOpen(false);
          setLecturePublishIsOpen(false);
        }}
      >
        <div className="px-6 pb-6">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Confirm Publish Lecture
          </h5>
          <p>Are you sure you want to Publish this Lecture?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              lectureUnpublishIsOpen(false);
              setLecturePublishIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleLecturePublishBox}>
            Okay
          </Button>
        </div>
      </Dialog>
      <Dialog
        isOpen={lectureUnpublishIsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          lectureUnpublishIsOpen(false);
          setLectureUnpublishIsOpen(false);
        }}
        onRequestClose={() => {
          setLecturePublishIsOpen(false);
          setLectureUnpublishIsOpen(false);
        }}
      >
        <div className="px-6 pb-6">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Confirm UnPublish Lecture
          </h5>
          <p>Are you sure you want to UnPublish this Lecture?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setLecturePublishIsOpen(false);
              setLectureUnpublishIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleLectureUnpublishBox}>
            Okay
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default LectureForm;
