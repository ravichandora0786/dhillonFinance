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
import AddEditActivityMaster from "./add/page";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteActivityMaster,
  getAllActivityMasters,
  setActivityMasterPagination,
  setActivityMasterSearchData,
} from "./slice";
import {
  selectAllActivityMasterList,
  selectActivityMasterPagination,
  selectActivityMasterSearchData,
} from "./selector";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import { removeTimeFromDate } from "@/Services/utils";
import DeleteConfirmationModal from "@/components/ui/deleteConfirmation";
import { toast } from "react-toastify";

const columns = (handleDelete, handleEdit) => [
  {
    header: () => <div className="">Activity name</div>,
    accessorKey: "name",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={getValue()} className={"font-bold"} />
    ),
  },
  {
    header: "Status ",
    accessorKey: "isActive",
    cell: ({ getValue }) => (
      <Status text={getValue() ? "Active" : "Inactive"} />
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
        editOnClick={() => handleEdit(row?.original)}
        deleteOnClick={() => handleDelete(row?.original)}
      />
    ),
  },
];

const ActivityMaster = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { confirm, ModalContent } = DeleteConfirmationModal();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectActivityMasterPagination);
  const activityMasterList = useSelector(selectAllActivityMasterList);
  const activityMasterSearchData = useSelector(selectActivityMasterSearchData);

  const searchFields = [
    {
      name: "name",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(
          setActivityMasterSearchData({
            ...activityMasterSearchData,
            name: value,
          })
        );
      },
    },
  ];

  const handleAddNewActivityMaster = () => {
    setOpenModal(true);
  };
  const handleDelete = async (rowData) => {
    const isConfirmed = await confirm();
    if (!isConfirmed) return;
    dispatch(
      deleteActivityMaster({
        id: rowData?.id,
        onSuccess: (response) => {
          getAllActivityMastersList(activityMasterSearchData, pagination);
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
  const handleRefrsh = () => {
    dispatch(setActivityMasterPagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setActivityMasterSearchData({ name: "" }));
  };

  //   Apis Functions
  const getAllActivityMastersList = (activityMasterSearchData, pagination) => {
    dispatch(
      getAllActivityMasters({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          name: activityMasterSearchData?.name,
        },
        onSuccess: ({ message, data }) => {},
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllActivityMastersList(activityMasterSearchData, pagination);
  }, [activityMasterSearchData, pagination]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-between items-center">
          <TitleAndDescription
            title="Activity"
            description="Manage your Modules"
          />
          {/* Create Button */}
          <div>
            <LoadingButton
              name={"addActivityMaster"}
              type={"button"}
              isLoading={false}
              disabled={false}
              onClick={handleAddNewActivityMaster}
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
                  value={activityMasterSearchData?.[field.name] ?? ""}
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
            data={activityMasterList?.activities || []}
            pagination={pagination}
            setPagination={(newPagination) => {
              dispatch(setActivityMasterPagination(newPagination));
            }}
            totalRows={activityMasterList?.totalItems}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
      <AddEditActivityMaster
        onBack={() => {
          setRowData({});
          setOpenModal(false);
        }}
        openModal={openModal}
        callBackFunc={getAllActivityMastersList}
        data={rowData}
      />
      {/* Delete Confirmation Modal */}
      {ModalContent}
    </>
  );
};
export default ActivityMaster;
