/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Input, Upload, Table } from "components/ui";
import React, { useEffect, useMemo, useState } from "react";
import {
  HiArrowNarrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiPlusCircle,
  HiTrash
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTable } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import CourseForm from "./courseForm";
import { FcImageFile } from "react-icons/fc";
import { FaEye, FaFileAlt } from "react-icons/fa";
import DisplayError from "views/common/displayError";
import FileUpload from "views/common/fileUpload";
const { Tr, Td, TBody } = Table;
const ReactTable = ({ columns, data }) => {
  const reorderData = async (startIndex, endIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
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
const CourseContentForm = () => {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [addCourseFlag, setAddCourseFlag] = useState(false);
  const [courseData, setCourseData] = useState();
  const [lectureLoading, setLectureLoading] = useState(false);
  const [lectureFormFlag, setLectureFormFlag] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    type: "file",
    content: "",
    title: ""
  });
  const [file, setFile] = useState();
  const [error, setError] = useState("");

  const handleAddNewCourseClick = () => {
    setAddCourseFlag(true);
  };
  const handleAddNewCourseCloseClick = () => {
    setAddCourseFlag(false);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);

  const fetchCourseData = async () => {
    try {
      const response = await axiosInstance.get(
        `user/instructor-course/${course_id}`
      );
      if (response.success) {
        setCourseData(response.data);
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

  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchCourseData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  const UpdateLectureContent = async (formData) => {
    try {
      setLectureLoading(true);
      const response = await axiosInstance.put(
        `user/instructor-content/${course_id}`,
        formData
      );
      if (response.success) {
        openNotification("success", response.message);
        setLectureForm({
          type: "file",
          content: "",
          title: ""
        });
        setLectureFormFlag(false);
        setApiFlag(true);
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
  const onHandleContentBox = async () => {
    try {
      if (lectureForm.type === "file") {
        if (!lectureForm.content && !file) {
          setError("Please Upload a Content file");
        }

        if (!lectureForm.title) {
          setError("Please Enter a Content Title");
        }
        if (file) {
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
              type: "file",
              content: lectureForm.content,
              title: lectureForm.title
              // id: lectureForm.id ? lectureForm.id : "",
            });
            setFile(null);
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
                    {props.row.original.type === "file" ? (
                      <FaFileAlt size={20} />
                    ) : (
                      <></>
                    )}
                  </p>
                  <p className="text-gray-500 text-base font-bold">
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
                  // setDeleteIsOpen(true);
                  // setSelectObject(props.row.original);
                }}
              >
                <HiOutlineTrash size={20} />
              </span>
            </div>
          </>
        )
      }
    ],
    []
  );
  return (
    <>
      <div>
        <div className="flex items-center mb-4">
          <div className="text-xl font-semibold text-center mr-4">
            <Button
              className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
              size="sm"
              icon={<HiArrowNarrowLeft size={30} />}
              onClick={async () => {
                navigate("/app/admin/content-hub/instructors");
              }}
            />
          </div>
          <h4
            className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Course Content Details
          </h4>
        </div>

        <Card>
          <div className="flex justify-between items-center">
            <div
              className={`text-lg font-bold text-${themeColor}-${primaryColorLevel} dark:text-white capitalize`}
            >
              {courseData?.courseName}
            </div>
            <Button
              variant="twoTone"
              icon={<HiOutlinePencil />}
              className={`border border-${themeColor}-${primaryColorLevel}`}
              onClick={async () => {
                handleAddNewCourseCloseClick();
                setTimeout(() => {
                  handleAddNewCourseClick();
                }, 50);
              }}
            >
              <span>Edit</span>
            </Button>
          </div>
        </Card>
        <div>
          {isLoading ? (
            <>
              <p>Loading....</p>
            </>
          ) : (
            <>
              {!lectureFormFlag &&
              courseData?.content &&
              courseData?.content?.length > 0 ? (
                <>
                  <Card className="mt-4">
                    <div className="flex flex-col justify-center bg-gray-100 rounded-b-lg w-full">
                      {courseData?.content?.length > 0 ? (
                        <>
                          <ReactTable
                            columns={columns}
                            data={courseData?.content}
                          />
                        </>
                      ) : (
                        <>
                          {" "}
                          <p className="flex justify-center items-center font-semibold text-lg">
                            No Content Available
                          </p>
                        </>
                      )}
                    </div>
                  </Card>
                </>
              ) : (
                <></>
              )}
              {lectureFormFlag ? (
                <>
                  <div className="mt-4 w-full  gap-y-4  items-center border-2 border-gray-300  py-4 px-4 bg-gray-200 rounded-lg">
                    <div className="col-span-1 gap-4 mb-4">
                      <div
                        className={`font-bold mb-1 text-${themeColor}-${primaryColorLevel}`}
                      >
                        File Title
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

                    {lectureForm?.content ? (
                      <>
                        <div className="flex flex-wrap items-center justify-start mb-4">
                          <div className="group relative p-2 rounded flex h-32 ">
                            {/* <img
                                          
                                          src={lectureForm.content}
                                          alt={lectureForm.content}
                                        /> */}
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
                                  window.open(lectureForm.content, "_blank");
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
                            onFileRemove={(file) => {
                              setFile(null);
                              setError("");
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
                                Support: PDF, PPTX, DOC, DOCX, XLS, XLSX
                              </p>
                            </div>
                          </Upload>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between my-2 mr-2">
                      <div>{DisplayError(error)}</div>
                      <div className="flex gap-4">
                        <Button
                          variant="solid"
                          onClick={() => {
                            setLectureFormFlag(false);
                          }}
                          color="red-500"
                        >
                          Close
                        </Button>
                        <Button variant="solid" onClick={onHandleContentBox}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                      onClick={() => {
                        setLectureFormFlag(true);
                        setLectureForm({
                          type: "file",
                          content: "",
                          title: ""
                        });
                      }}
                    >
                      <span>Add New Content</span>
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <CourseForm
        isOpen={addCourseFlag}
        handleCloseClick={handleAddNewCourseCloseClick}
        setCourseData={setCourseData}
        courseData={courseData}
      />
    </>
  );
};

export default CourseContentForm;
