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
  selectAllStaffDataList,
  selectStaffPagination,
  selectStaffSearchData,
} from "./selector";
import {
  getAllStaffDataList,
  setAllStaffList,
  setStaffPagination,
  setStaffSearchData,
} from "./slice";

const columns = () => [
  {
    header: () => <div className="">Name</div>,
    accessorKey: "admissionNumber",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={getValue()} className={"font-bold"} />
    ),
  },
  {
    header: "Department",
    accessorKey: "rollNumber",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Designation",
    accessorKey: "firstName",
    cell: ({ row }) => (
      <SingleParagraphColumn
        value={`${row.original.firstName} ${row.original.lastName}`}
      />
    ),
  },
  {
    header: "Phone",
    accessorKey: "classSection.class.name",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Email",
    accessorKey: "classSection.section.name",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Date of Joining",
    accessorKey: "gender",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <ActionColumnsComponent
        // showDeleteButton={true}
        showEditButton={true}
        editOnClick={() => {}}
        // deleteOnClick={() => handleDelete(row?.original)}
      />
    ),
  },
];

const StaffsScreen = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState({});

  const pagination = useSelector(selectStaffPagination);
  const staffList = useSelector(selectAllStaffDataList);
  const staffSearchData = useSelector(selectStaffSearchData);

  const searchFields = [
    {
      name: "search",
      label: "",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(setStaffSearchData({ ...staffSearchData, search: value }));
      },
    },
  ];

  const handleAddNewUser = () => {
    navigate.push("/users/staff/add");
  };

  const getAllStaffList = () => {
    dispatch(
      getAllStaffDataList({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          search: staffSearchData?.search,
        },
        onSuccess: ({ message, data }) => {
          dispatch(setAllStaffList(data));
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllStaffList(staffSearchData, pagination);
  }, [staffSearchData, pagination]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-between items-center">
          <TitleAndDescription
            title="Staffs"
            description="Manage your Staffs"
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
              <span className="text-sm font-medium">Add New Staff</span>
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
                  value={staffSearchData?.[field.name]}
                />
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <RefreshIcon />
          </button>
        </div>
        <div className="flex-auto w-full">
          <DataTableComponent
            columns={columns()}
            data={staffList?.staffs || []}
            pagination={pagination}
            setPagination={(newPagination) => {
              dispatch(setStaffPagination(newPagination));
            }}
            totalRows={staffList?.totalItems}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
    </>
  );
};
export default StaffsScreen;
