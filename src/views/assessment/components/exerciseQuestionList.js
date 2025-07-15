/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Dialog,
  Spinner,
  Table
} from "components/ui";
import { useTable } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HiOutlineMenu, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";

const { Tr, Td, TBody } = Table;

const ReactTable = ({ columns, data, onChange, exerciseData }) => {
  const reorderData = async (startIndex, endIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);

    const formData = {
      title: exerciseData.title,
      description: exerciseData?.description,
      totalMarks: exerciseData.totalMarks,
      questions: newData.map((info) => info._id)
    };
    const response = await axiosInstance.put(
      `user/exercise/${exerciseData._id}`,
      formData
    );
    if (response?.success && response?.data?._id) {
      // openNotification("success", response.message);
      onChange(newData);
    } else {
      openNotification("danger", response.message);
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

const DragAndDrop = (props) => {
  const { exerciseData, setAddQuestion, setQuestionData, setApiFlag } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectObject, setSelectObject] = useState();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [multiDeleteIsOpen, setMultiDeleteIsOpen] = useState(false);

  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  const handleSelectQuestion = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      const newSelected = selectedQuestions.filter((id) => id !== questionId);
      setSelectedQuestions(newSelected);
      setSelectAll(false);
    } else {
      const newSelected = [...selectedQuestions, questionId];
      setSelectedQuestions(newSelected);
      if (newSelected.length === data.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([]);
      setSelectAll(false);
    } else {
      setSelectedQuestions(data.map((question) => question._id));
      setSelectAll(true);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "question",
        Cell: (props) => {
          return (
            <>
              <>
                <div className="flex items-center gap-2 ">
                  <div>
                    <Checkbox
                      checked={selectedQuestions.includes(
                        props.row.original._id
                      )}
                      onChange={() =>
                        handleSelectQuestion(props.row.original._id)
                      }
                    />
                  </div>
                  <div>
                    <Avatar
                      size="sm"
                      className={`mr-3 bg-gray-${primaryColorLevel} text-white`}
                    >
                      {props?.row?.index + 1}
                    </Avatar>
                  </div>
                  <div>
                    <span
                      className={`font-semibold text-gray-${primaryColorLevel} text-lg line-clamp-1	`}
                    >
                      {props?.value.replace(/<[^>]+>/g, "") ||
                        "Multiple Choice"}
                    </span>
                  </div>
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
                  setAddQuestion(true);
                  setQuestionData(props.row.original);
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
    [selectedQuestions, handleSelectQuestion]
  );

  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        `user/get-equestions/${exerciseData._id}`,
        {
          pageNo: 1,
          perPage: 100,
          status: "all"
        }
      );
      if (response.success) {
        setData(response.data);
        setLoading(false);
      } else {
        openNotification("danger", response.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("get-all-batch error:", error);
      openNotification("danger", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exerciseData?._id) {
      fetchData();
    }
  }, [exerciseData]);

  useEffect(() => {
    // Reset selected questions when data changes
    setSelectedQuestions([]);
    setSelectAll(false);
  }, [data]);

  const onHandleDeleteBox = async () => {
    try {
      const response = await axiosInstance.delete(
        `user/equestion/${selectObject._id}`
      );
      if (response.success) {
        openNotification("success", response.message);
        setApiFlag(true);
        setDeleteIsOpen(false);
      } else {
        openNotification("danger", response.message);
        setDeleteIsOpen(false);
      }
    } catch (error) {
      console.log("onHandleDeleteBox error:", error);
      openNotification("danger", error.message);
      setDeleteIsOpen(false);
    }
  };

  const handleMultiDelete = async () => {
    if (selectedQuestions.length === 0) return;

    try {
      const response = await axiosInstance.post(
        `user/delete-equestions`,
        { questionIds: selectedQuestions },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.success) {
        openNotification(
          "success",
          response.message || "Questions deleted successfully"
        );
        setApiFlag(true);
      } else {
        openNotification(
          "danger",
          response.message || "Failed to delete questions"
        );
      }
    } catch (error) {
      console.log("onHandleDeleteBox error:", error);
      openNotification("danger", error.message);
    } finally {
      setSelectedQuestions([]);
      setSelectAll(false);
      setMultiDeleteIsOpen(false);
    }
  };

  return (
    <>
      {!loading ? (
        data?.length > 0 ? (
          <Card>
            <div className="flex justify-between items-center mb-3">
              <div className="block text-gray-700 text-lg font-bold">
                Questions
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center">
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                  <span className="text-sm">Select All</span>
                </div>
                <Button
                  size="sm"
                  variant="solid"
                  disabled={!selectedQuestions.length}
                  onClick={() => setMultiDeleteIsOpen(true)}
                  className={`bg-${themeColor}-${primaryColorLevel}`}
                >
                  Delete
                </Button>
              </div>
            </div>
            <ReactTable
              columns={columns}
              onChange={(newList) => setData(newList)}
              data={data}
              exerciseData={exerciseData}
              setAddQuestion={setAddQuestion}
            />
          </Card>
        ) : (
          <>
            <div className="flex justify-center text-base">
              There is no data to display.
            </div>
          </>
        )
      ) : (
        <>
          <div className="flex justify-center">
            <Spinner size="3.25rem" />
          </div>
        </>
      )}
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
            Confirm Delete of Question
          </h5>
          <p>Are you sure you want to delete this Question?</p>
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
          <Button variant="solid" onClick={onHandleDeleteBox}>
            Okay
          </Button>
        </div>
      </Dialog>

      <Dialog
        isOpen={multiDeleteIsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setMultiDeleteIsOpen(false);
        }}
        onRequestClose={() => {
          setMultiDeleteIsOpen(false);
        }}
      >
        <div className="px-6 pb-6">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Confirm Delete
          </h5>
          <p>Are you sure you want to delete these questions?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setMultiDeleteIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleMultiDelete}>
            Okay
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default DragAndDrop;
