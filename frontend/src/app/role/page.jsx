"use client";
import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import DataTableComponent from "@/components/dataTableComponent";
import Status from "@/components/ui/status";
import InputBox from "@/components/ui/inputBox";
import Label from "@/components/ui/label";
import LoadingButton from "@/components/ui/loadingButton";
import TitleAndDescription from "@/components/ui/titleAndDescription";
import { useRouter } from "next/navigation";
import GenericModal from "@/components/ui/genericModal";
import AddEditRole from "./add/page";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRole,
  getAllRoles,
  setAllRoleList,
  setRoleId,
  setRolePagination,
  setRoleSearchData,
} from "./slice";
import {
  selectAllRoleList,
  selectRoleId,
  selectRolePagination,
  selectRoleSearchData,
} from "./selector";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import { removeTimeFromDate } from "@/Services/utils";
import DeleteConfirmationModal from "@/components/ui/deleteConfirmation";
import { toast } from "react-toastify";
import ActivityPermissionManage from "./activityPermissionManage";

const columns = (handleDelete, handleEdit, handleActivityPermissions) => [
  {
    header: () => <div className="">Role name</div>,
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
    accessorKey: "isActive",
    cell: ({ getValue }) => (
      <Status text={getValue() == true ? "Active" : "Inactive"} />
    ),
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
        showPermissionButton={true}
        editOnClick={() => handleEdit(row?.original)}
        deleteOnClick={() => handleDelete(row?.original)}
        permissionOnClick={() => handleActivityPermissions(row?.original)}
      />
    ),
  },
];

const Role = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { confirm, ModalContent } = DeleteConfirmationModal();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectRolePagination);
  const roleList = useSelector(selectAllRoleList);
  const roleSearchData = useSelector(selectRoleSearchData);
  const roleId = useSelector(selectRoleId);

  const searchFields = [
    {
      name: "name",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(setRoleSearchData({ ...roleSearchData, name: value }));
      },
    },
  ];

  const handleAddNewRole = () => {
    setOpenModal(true);
  };
  const handleDelete = async (rowData) => {
    const isConfirmed = await confirm();
    if (!isConfirmed) return;
    dispatch(
      deleteRole({
        id: rowData?.id,
        onSuccess: (response) => {
          getAllRolesList(roleSearchData, pagination);
          toast.success(response?.message);
        },
        onFailure: () => {},
      })
    );
  };
  const handleEdit = (rowData) => {
    setOpenModal(true);
    setRowData(rowData);
  };
  const handleActivityPermissions = (rowData) => {
    dispatch(setRoleId(rowData?.id));
  };
  const handleRefrsh = () => {
    dispatch(setRolePagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setRoleSearchData({ name: "" }));
  };

  //   Apis Functions
  const getAllRolesList = (roleSearchData, pagination) => {
    dispatch(
      getAllRoles({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          name: roleSearchData?.name,
        },
        onSuccess: ({ message, data }) => {
          dispatch(setAllRoleList(data));
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllRolesList(roleSearchData, pagination);
  }, [roleSearchData, pagination]);

  return (
    <>
      {roleId ? (
        <>
          <ActivityPermissionManage roleId={roleId} />
        </>
      ) : (
        <>
          {" "}
          <div className="w-full flex flex-col gap-4 justify-between  p-4">
            <div className="w-full flex flex-row justify-between items-center">
              <TitleAndDescription
                title="Roles & Permissions"
                description="Manage your roles and their permissions"
              />
              {/* Create Button */}
              <div>
                <LoadingButton
                  name={"addRole"}
                  type={"button"}
                  isLoading={false}
                  disabled={false}
                  onClick={handleAddNewRole}
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
                      value={roleSearchData?.[field.name] ?? ""}
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
                columns={columns(
                  handleDelete,
                  handleEdit,
                  handleActivityPermissions
                )}
                data={roleList?.roles || []}
                pagination={pagination}
                setPagination={(newPagination) =>
                  dispatch(setRolePagination(newPagination))
                }
                totalRows={roleList?.roles?.length}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
              />
            </div>
          </div>
          <AddEditRole
            onBack={() => {
              setRowData({});
              setOpenModal(false);
            }}
            openModal={openModal}
            callBackFunc={getAllRolesList}
            data={rowData}
          />
          {/* Delete Confirmation Modal */}
          {ModalContent}
        </>
      )}
    </>
  );
};
export default Role;
