import React, { useMemo } from "react";
import { Avatar, Card, Table } from "components/ui";
import { useTable } from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdDragIndicator } from "react-icons/md";
import { HiOutlineMenu, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useSelector } from "react-redux";

const { Tr, Th, Td, THead, TBody } = Table;
const users = [
  { id: "1", question: "What is the output of the following code?" },
  {
    id: "2",
    question: "In React, what is the purpose of the useEffect hook?",
  },
  {
    id: "3",
    question:
      "Which of the following TypeScript types represents an object with optional properties?",
  },
  {
    id: "4",
    question:
      "Which of the following TypeScript types represents an object with optional properties?",
  },
  {
    id: "5",
    question:
      "Which of the following TypeScript types represents an object with optional properties?",
  },
  {
    id: "6",
    question:
      "Which of the following TypeScript types represents an object with optional properties?",
  },
];

const ReactTable = ({ columns, data, onChange }) => {
  const reorderData = (startIndex, endIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);

    console.log(
      "newDataIds :L",
      newData.map((info) => `Row - ${info.id}`)
    );
    onChange(newData);
  };

  const table = useTable({ columns, data });

  const { getTableProps, headerGroups, prepareRow, rows } = table;

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
                    draggableId={row.original.id.toString()}
                    key={row.original.id}
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
                                dragHandleProps: provided.dragHandleProps,
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

const DragAndDrop = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
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
                  <Avatar
                    size="sm"
                    className={`mr-3 bg-gray-${primaryColorLevel} text-white`}
                  >
                    {props?.row?.index + 1}
                  </Avatar>
                  <span
                    className={`font-semibold text-gray-${primaryColorLevel} `}
                  >
                    {props?.value}
                  </span>
                </div>
              </>
            </>
          );
        },
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
              <span>
                <HiOutlinePencil size={20} />
              </span>
              <span>
                <HiOutlineTrash size={20} />
              </span>
              <span {...props.dragHandleProps}>
                <HiOutlineMenu size={20} />
              </span>
            </div>
          </>
        ),
      },
    ],
    []
  );

  const [data, setData] = React.useState(users);

  return (
    <Card>
      <div className="block text-gray-700 text-lg font-bold mb-3 ">
        Questions
      </div>
      <ReactTable
        columns={columns}
        onChange={(newList) => setData(newList)}
        data={data}
      />
    </Card>
  );
};

export default DragAndDrop;
