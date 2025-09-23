/**
 * Customer List screen
 */
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
import LoadingButton from "@/components/ui/loadingButton";
import TitleAndDescription from "@/components/ui/titleAndDescription";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomer,
  getAllCustomers,
  setAllCustomerList,
  setCustomerId,
  setCustomerPagination,
  setCustomerSearchData,
} from "./slice";
import {
  selectAllCustomerList,
  selectCustomerId,
  selectCustomerPagination,
  selectCustomerSearchData,
} from "./selector";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import { removeTimeFromDate } from "@/Services/utils";
import DeleteConfirmationModal from "@/components/ui/deleteConfirmation";
import { toast } from "react-toastify";

const columns = (handleDelete) => [
  {
    header: () => <div className="">Customer name</div>,
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
    header: "Created ad",
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
        showEditLink={true}
        editOnLink={() => navigate.push(`/customer/edit/${row.original.id}`)}
        deleteOnClick={() => handleDelete(row?.original)}
      />
    ),
  },
];

const Customer = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { confirm, ModalContent } = DeleteConfirmationModal();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectCustomerPagination);
  const customerList = useSelector(selectAllCustomerList);
  const customerSearchData = useSelector(selectCustomerSearchData);
  const customerId = useSelector(selectCustomerId);

  const searchFields = [
    {
      name: "name",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(setCustomerSearchData({ ...customerSearchData, name: value }));
      },
    },
  ];

  const handleAddNewCustomer = () => {
    navigate.push("/customer/add");
  };
  const handleDelete = async (rowData) => {
    const isConfirmed = await confirm();
    if (!isConfirmed) return;
    dispatch(
      deleteCustomer({
        id: rowData?.id,
        onSuccess: (response) => {
          getAllCustomersList(customerSearchData, pagination);
          toast.success(response?.message);
        },
        onFailure: () => {},
      })
    );
  };

  const handleRefrsh = () => {
    dispatch(setCustomerPagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setCustomerSearchData({ name: "" }));
  };

  //   Apis Functions
  const getAllCustomersList = (customerSearchData, pagination) => {
    dispatch(
      getAllCustomers({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          name: customerSearchData?.name,
        },
        onSuccess: ({ message, data }) => {
          dispatch(setAllCustomerList(data));
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllCustomersList(customerSearchData, pagination);
  }, [customerSearchData, pagination]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <TitleAndDescription
            title="Customers"
            description="Manage your customers"
          />
          {/* Create Button */}
          <div>
            <LoadingButton
              name={"addCustomer"}
              type={"button"}
              isLoading={false}
              disabled={false}
              onClick={handleAddNewCustomer}
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
                  value={customerSearchData?.[field.name] ?? ""}
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
        <div className="w-full">
          <DataTableComponent
            columns={columns(handleDelete)}
            data={customerList?.customers || []}
            pagination={pagination}
            setPagination={(newPagination) =>
              dispatch(setCustomerPagination(newPagination))
            }
            totalRows={customerList?.customers?.length}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {ModalContent}
    </>
  );
};
export default Customer;
