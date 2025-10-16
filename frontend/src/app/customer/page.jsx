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
  updateCustomerStatus,
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
import ConfirmationModal from "@/components/ui/deleteConfirmation";
import CustomerDetailModal from "@/components/ui/pagesComponents/customerDetailModal";
import ReceiveMoneyModal from "@/components/ui/pagesComponents/receiveMoneyModal";
import { toast } from "react-toastify";
import { closeCustomerLoanWithTransaction } from "../loan/slice";
import FullScreenLoader from "@/components/ui/fullScreenLoader";

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

const Customer = () => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { confirm, ModalContent } = ConfirmationModal();
  const [screenLoading, setScreenLoading] = useState(false);
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
    const isConfirmed = await confirm({
      title: "",
      message:
        "Are you sure you want to delete this Customer? Once deleted, it cannot be restored.",
      icon: "delete",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });
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
    const loan = rowData?.loans?.[0];
    if (!loan) {
      toast.error("No active loan found for this customer");
      return;
    }

    const isConfirmed = await confirm({
      title: "",
      message: "Are you sure you want to close this loan?",
      icon: "info",
      confirmText: "Yes, Close Loan",
      cancelText: "Cancel",
      details: [
        {
          label: "Customer Name",
          value: `${rowData?.firstName} ${rowData?.lastName}`,
        },
        {
          label: "Loan Amount",
          value: `${loan?.amount}`,
        },
        {
          label: "Receivable Loan Amount",
          value: `${loan?.totalPayableAmount}`,
        },
        { label: "Pending Emi", value: `${loan?.pendingEmis}` },
        { label: "Pending Amount", value: `₹${loan?.repaymentsPending}` },
        {
          label: "EMIs Paid",
          value: `${loan?.paidEmis} of ${loan?.tenureMonths}`,
        },
      ],
    });

    if (!isConfirmed) return;

    setScreenLoading(true);

    dispatch(
      closeCustomerLoanWithTransaction({
        data: { loanId: loan?.id, customerId: rowData?.id },
        onSuccess: (response) => {
          toast.success(response?.message);
          getAllCustomersList(customerSearchData, pagination);
          setScreenLoading(false);
        },
        onFailure: () => {
          setScreenLoading(false);
        },
      })
    );
  };

  const handleCustomerStatus = async (id, status) => {
    setScreenLoading(true);
    dispatch(
      updateCustomerStatus({
        id,
        data: { status },
        onSuccess: (response) => {
          toast.success(response?.message);
          getAllCustomersList(customerSearchData, pagination);
          setScreenLoading(false);
        },
        onFailure: () => {
          setScreenLoading(false);
        },
      })
    );
  };

  const handleRefresh = () => {
    dispatch(setCustomerPagination({ pageIndex: 0, pageSize: 12 }));
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
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customerList?.customers?.length > 0 ? (
              customerList.customers.map((item, index) => (
                <CustomerCardComponent
                  key={index}
                  customer={item}
                  handleDelete={handleDelete}
                  handleView={handleView}
                  handleReceivedMoneyBtn={handleReceivedMoneyBtn}
                  handleCloseCustomerLoan={handleCloseCustomerLoan}
                  handleCustomerStatus={handleCustomerStatus}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
                <p className="text-lg font-medium">No customer records found</p>
              </div>
            )}
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
        callBackFunc={() => {
          getAllCustomersList(customerSearchData, pagination);
        }}
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
      <FullScreenLoader showLoader={screenLoading} message="Please Wait..." />
    </>
  );
};
export default Customer;
