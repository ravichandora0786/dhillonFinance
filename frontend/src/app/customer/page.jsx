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
import CustomerCardComponent from "@/components/ui/customerCard";
import Status from "@/components/ui/status";
import InputBox from "@/components/ui/inputBox";
import LoadingButton from "@/components/ui/loadingButton";
import CustomPagination from "@/components/ui/pagination";
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
import NameAvatarColumn from "@/components/tableCollumnComponents/nameWithImageCol";
import ButtonColumn from "@/components/tableCollumnComponents/buttonCol";
import DeleteConfirmationModal from "@/components/ui/deleteConfirmation";
import CustomerDetailModal from "@/components/ui/pagesComponents/customerDetailModal";
import ReceiveMoneyModal from "@/components/ui/pagesComponents/receiveMoneyModal";
import { toast } from "react-toastify";
import { closeCustomerLoanWithTransaction } from "../loan/slice";

const columns = (handleDelete, handleView, handleReceivedMoneyBtn) => [
  {
    header: () => <div className="">Customer name</div>,
    accessorKey: "firstName",
    cell: ({ row, getValue }) => (
      <NameAvatarColumn
        name={`${getValue()} ${row.original.lastName}`}
        mobileNumber={`${row.original.mobileNumber}`}
        showImage={true}
        showMobile={true}
        imageUrl={row.original?.profileFile?.image}
      />
    ),
  },
  {
    header: "Loan Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <SingleParagraphColumn
        value={`${row.original.loans?.[0]?.totalPayableAmount || 0}`}
      />
    ),
  },
  {
    header: "Loan Received Amount",
    accessorKey: "recieved",
    cell: ({ row }) => (
      <SingleParagraphColumn
        value={`${row.original.loans?.[0]?.repaymentsReceived || 0}`}
      />
    ),
  },
  {
    header: "Loan Pending Amount",
    accessorKey: "pending",
    cell: ({ row }) => (
      <SingleParagraphColumn
        value={`${row.original.loans?.[0]?.repaymentsPending || 0}`}
      />
    ),
  },
  {
    header: "Current Loan Transactions",
    accessorKey: "t",
    cell: ({ row }) => (
      <SingleParagraphColumn
        value={`${row.original.loans?.[0]?.transactions?.length || 0}`}
      />
    ),
  },
  {
    header: "Current Loan Status ",
    accessorKey: "loans[0].status",
    cell: ({ row }) => <Status text={`${row.original?.loans[0]?.status}`} />,
  },
  {
    header: "Receive Money",
    accessorKey: "rm",
    cell: ({ row }) => (
      <ButtonColumn
        buttonName={"Receive Money"}
        onClick={() => {
          handleReceivedMoneyBtn(row?.original);
        }}
      />
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <ActionColumnsComponent
        showDeleteButton={true}
        showEditLink={true}
        editOnLink={`/customer/edit/${row.original.id}`}
        deleteOnClick={() => handleDelete(row?.original)}
        showViewButton={true}
        viewOnClick={() => {
          handleView(row?.original);
        }}
      />
    ),
  },
];

const Customer = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const { confirm, ModalContent } = DeleteConfirmationModal();
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [openViewDetailModal, setOpenViewDetailModal] = useState(false);
  const [openReceivedMoneyModal, setOpenReceivedMoneyModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectCustomerPagination);
  const customerList = useSelector(selectAllCustomerList);
  const customerSearchData = useSelector(selectCustomerSearchData);

  const searchFields = [
    {
      name: "search",
      placeholder: "Search by name,number",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(
          setCustomerSearchData({ ...customerSearchData, search: value })
        );
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

  const handleCloseCustomerLoan = async (rowData) => {
    // const isConfirmed = await confirm();
    // if (!isConfirmed) return;
    dispatch(
      closeCustomerLoanWithTransaction({
        data: { loanId: rowData?.loans[0]?.id, customerId: rowData?.id },
        onSuccess: (response) => {
          toast.success(response?.message);
        },
        onFailure: () => {},
      })
    );
  };

  const handleRefresh = () => {
    dispatch(setCustomerPagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setCustomerSearchData({ search: "" }));
  };

  const handleView = (rowData) => {
    setRowData(rowData);
    setOpenViewDetailModal(true);
  };

  const handleReceivedMoneyBtn = (rowData) => {
    setRowData(rowData);
    setOpenReceivedMoneyModal(true);
  };

  //   Apis Functions
  const getAllCustomersList = (customerSearchData, pagination) => {
    dispatch(
      getAllCustomers({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          search: customerSearchData?.search,
        },
        onSuccess: ({ message, data }) => {
          console.log(message);
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
                  placeholder={`${field?.placeholder}`}
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
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </LoadingButton>
          </div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {customerList?.customers?.map((item, index) => (
              <CustomerCardComponent
                key={index}
                customer={item}
                handleDelete={handleDelete}
                handleView={handleView}
                handleReceivedMoneyBtn={handleReceivedMoneyBtn}
                handleCloseCustomerLoan={handleCloseCustomerLoan}
              />
            ))}
          </div>
          {/* Common Pagination */}
          <CustomPagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            total={customerList?.total}
            onPageChange={(newPage) =>
              dispatch(
                setCustomerPagination({
                  ...pagination,
                  pageIndex: newPage,
                })
              )
            }
          />
          {/* <DataTableComponent
            columns={columns(handleDelete, handleView, handleReceivedMoneyBtn)}
            data={customerList?.customers || []}
            pagination={pagination}
            setPagination={(newPagination) =>
              dispatch(setCustomerPagination(newPagination))
            }
            totalRows={customerList?.total}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          /> */}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {ModalContent}

      <CustomerDetailModal
        openModal={openViewDetailModal}
        onBack={() => {
          setRowData({});
          setOpenViewDetailModal(false);
        }}
        data={rowData}
      />
      <ReceiveMoneyModal
        openModal={openReceivedMoneyModal}
        onBack={() => {
          setRowData({});
          setOpenReceivedMoneyModal(false);
        }}
        data={rowData}
        callBackFunc={() => {
          getAllCustomersList(customerSearchData, pagination);
        }}
      />
    </>
  );
};
export default Customer;
