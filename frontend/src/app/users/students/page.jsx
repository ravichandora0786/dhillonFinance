"use client";
import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import DataTableComponent from "@/components/dataTableComponent";
import InputBox from "@/components/ui/inputBox";
import LoadingButton from "@/components/ui/loadingButton";
import TitleAndDescription from "@/components/ui/titleAndDescription";
import { useRouter } from "next/navigation";
import { removeTimeFromDate } from "@/Services/utils";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllStudentDataList,
  selectStudentPagination,
  selectStudentSearchData,
} from "./selector";
import {
  getAllStudentDataList,
  setAllStudentList,
  setStudentPagination,
  setStudentSearchData,
} from "./slice";
import Status from "@/components/ui/status";

const columns = () => [
  {
    header: () => <div className="">Admission No</div>,
    accessorKey: "admissionNumber",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={getValue()} className={"font-bold"} />
    ),
  },
  {
    header: "Roll No ",
    accessorKey: "classRollNumber",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Name",
    accessorKey: "firstName",
    cell: ({ row }) => (
      <SingleParagraphColumn
        value={`${row.original.firstName} ${row.original.lastName}`}
      />
    ),
  },
  {
    header: "Department",
    accessorKey: "classDepartmentSection.department.name",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Class/Section",
    accessorKey: "classDepartmentSection.class.name",
    cell: ({ row, getValue }) => (
      <SingleParagraphColumn
        value={`${getValue()} - ${
          row.original.classDepartmentSection.section.name
        }`}
      />
    ),
  },
  {
    header: "Gender",
    accessorKey: "gender",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Category",
    accessorKey: "category",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: ({ getValue }) => (
      <Status text={getValue() ? "Active" : "Inactive"} />
    ),
  },
  {
    header: "Date of Join",
    accessorKey: "dateOfAdmission",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
    ),
  },
  {
    header: "DOB",
    accessorKey: "dateOfBirth",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <ActionColumnsComponent
        // showDeleteButton={true}
        showEditLink={true}
        editOnLink={`/users/students/edit/${row?.original?.id}`}
        // deleteOnClick={() => handleDelete(row?.original)}
      />
    ),
  },
];

const StudentsScreen = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const [columnVisibility, setColumnVisibility] = useState({});

  const pagination = useSelector(selectStudentPagination);
  const studentList = useSelector(selectAllStudentDataList);
  const studentSearchData = useSelector(selectStudentSearchData);

  const searchFields = [
    {
      name: "search",
      label: "",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(setStudentSearchData({ ...studentSearchData, search: value }));
      },
    },
  ];

  const handleAddNewUser = () => {
    navigate.push("/users/students/add");
  };

  const getAllStudentList = () => {
    dispatch(
      getAllStudentDataList({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          search: studentSearchData?.search,
        },
        onSuccess: ({ message, data }) => {
          dispatch(setAllStudentList(data));
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllStudentList(studentSearchData, pagination);
  }, [studentSearchData, pagination]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-between items-center">
          <TitleAndDescription
            title="Students"
            description="Manage your Students"
          />
          {/* Create Button */}
          <div>
            <LoadingButton
              name={"addUser"}
              type={"button"}
              isLoading={false}
              disabled={false}
              onClick={handleAddNewUser}
            >
              <AddIcon fontSize="small" />
              <span className="text-sm font-medium">Add New Student</span>
            </LoadingButton>
          </div>
        </div>

        <div className="flex-auto w-full bg-white py-2 rounded-lg flex items-center gap-4">
          {/* Search Input */}
          <div className="flex flex-column gap-2 flex-1">
            {searchFields.map((field, index) => (
              <div key={index} className="relative flex-1 max-w-[200px]">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputBox
                  type="text"
                  placeholder={`Search ${field?.label}`}
                  className="pl-10"
                  onChange={field?.onChange}
                  value={studentSearchData?.[field.name]}
                />
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
            onClick={() => {
              dispatch(setStudentSearchData({ search: "" }));
            }}
          >
            <RefreshIcon />
          </button>
        </div>
        <div className="flex-auto w-full">
          <DataTableComponent
            columns={columns()}
            data={studentList?.students || []}
            pagination={pagination}
            setPagination={(newPagination) => {
              dispatch(setStudentPagination(newPagination));
            }}
            totalRows={studentList?.totalItems}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
    </>
  );
};
export default StudentsScreen;
