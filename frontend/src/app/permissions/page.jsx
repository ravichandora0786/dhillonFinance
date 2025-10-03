"use client";
import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import DataTableComponent from "@/components/dataTableComponent";
import Status from "@/components/ui/status";
import InputBox from "@/components/ui/inputBox";
import LoadingButton from "@/components/ui/loadingButton";
import TitleAndDescription from "@/components/ui/titleAndDescription";
import { useRouter } from "next/navigation";
import AddEditPermission from "@/components/ui/pagesComponents/addEditPermissionComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePermission,
  getAllPermissions,
  setAllPermissionList,
  setPermissionPagination,
  setPermissionSearchData,
} from "./slice";
import {
  selectAllPermissionList,
  selectPermissionPagination,
  selectPermissionSearchData,
} from "./selector";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import { removeTimeFromDate } from "@/Services/utils";
import DeleteConfirmationModal from "@/components/ui/deleteConfirmation";
import { toast } from "react-toastify";

const columns = (handleDelete, handleEdit) => [
  {
    header: () => <div className="">Permission name</div>,
    accessorKey: "name",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={getValue()} className={"font-bold"} />
    ),
  },

  {
    header: "Description",
    accessorKey: "description",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Status ",
    accessorKey: "status",
    cell: ({ getValue }) => <Status text={getValue()} />,
  },
  {
    header: "Created On",
    accessorKey: "createdAt",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <ActionColumnsComponent
        showDeleteButton={true}
        showEditButton={true}
        editOnClick={() => handleEdit(row?.original)}
        deleteOnClick={() => handleDelete(row?.original)}
      />
    ),
  },
];

const Permission = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { confirm, ModalContent } = DeleteConfirmationModal();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectPermissionPagination);
  const permissionList = useSelector(selectAllPermissionList);
  const permissionSearchData = useSelector(selectPermissionSearchData);

  const searchFields = [
    {
      name: "name",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(
          setPermissionSearchData({ ...permissionSearchData, name: value })
        );
      },
    },
  ];

  const handleAddNewPermission = () => {
    setOpenModal(true);
  };
  const handleDelete = async (rowData) => {
    const isConfirmed = await confirm();
    if (!isConfirmed) return;
    dispatch(
      deletePermission({
        id: rowData?.id,
        onSuccess: ({ message }) => {
          getAllPermissionsList(permissionSearchData, pagination);
          toast.success(message);
        },
        onFailure: () => {},
      })
    );
  };
  const handleEdit = (rowData) => {
    setOpenModal(true);
    setRowData(rowData);
  };
  const handleRefrsh = () => {
    dispatch(setPermissionPagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setPermissionSearchData({ name: "" }));
  };

  //   Apis Functions
  const getAllPermissionsList = (permissionSearchData, pagination) => {
    dispatch(
      getAllPermissions({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          name: permissionSearchData?.name,
        },
        onSuccess: ({ message, data }) => {
          console.log(message);
          dispatch(setAllPermissionList(data));
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllPermissionsList(permissionSearchData, pagination);
  }, [permissionSearchData, pagination]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-between items-center">
          <TitleAndDescription
            title="Permissions"
            description="Manage your permissions"
          />
          {/* Create Button */}
          <div>
            <LoadingButton
              name={"addPermission"}
              type={"button"}
              isLoading={false}
              disabled={false}
              onClick={handleAddNewPermission}
            >
              <AddIcon fontSize="small" />
              <span className="text-sm font-medium">Add New</span>
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
                  placeholder={`Search by ${field?.name}`}
                  className="pl-10"
                  onChange={field?.onChange}
                  value={permissionSearchData?.[field.name] ?? ""}
                />
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <div>
            <LoadingButton
              name={"refresh"}
              type={"button"}
              isLoading={false}
              disabled={false}
              variant="secondary"
              onClick={handleRefrsh}
            >
              <RefreshIcon />
            </LoadingButton>
          </div>
        </div>
        <div className="flex-auto w-full">
          <DataTableComponent
            columns={columns(handleDelete, handleEdit)}
            data={permissionList?.permissions || []}
            pagination={pagination}
            setPagination={(newPagination) =>
              dispatch(setPermissionPagination(newPagination))
            }
            totalRows={permissionList?.permissions?.length}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
      <AddEditPermission
        onBack={() => {
          setRowData({});
          setOpenModal(false);
        }}
        openModal={openModal}
        callBackFunc={getAllPermissionsList}
        data={rowData}
      />
      {/* Delete Confirmation Modal */}
      {ModalContent}
    </>
  );
};
export default Permission;
