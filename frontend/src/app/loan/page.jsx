/**
 * CustomerLoan List screen
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
import LoanDetailModal from "@/components/ui/pagesComponents/loanDetailsModal";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomerLoan,
  getAllCustomerLoans,
  setAllCustomerLoanList,
  setCustomerLoanId,
  setCustomerLoanPagination,
  setCustomerLoanSearchData,
} from "./slice";
import {
  selectAllCustomerLoanList,
  selectCustomerLoanId,
  selectCustomerLoanPagination,
  selectCustomerLoanSearchData,
} from "./selector";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import { removeTimeFromDate } from "@/Services/utils";
import ConfirmationModal from "@/components/ui/deleteConfirmation";
import { toast } from "react-toastify";
import ReceiveMoneyModal from "@/components/ui/pagesComponents/receiveMoneyModal";

const columns = (handleDelete, handleViewLoan, handlePayEmi) => [
  {
    header: () => <div className="">Customer name</div>,
    accessorKey: "customer.firstName",
    cell: ({ row, getValue }) => (
      <SingleParagraphColumn
        value={`${getValue()} ${row.original.customer.lastName} s/o ${
          row.original.customer.fatherName
        }`}
        className={"font-bold"}
      />
    ),
  },
  {
    header: "Principal Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Total Amount",
    accessorKey: "totalPayableAmount",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Paid/Total Installment",
    accessorKey: "tenureMonths",
    cell: ({ row, getValue }) => (
      <SingleParagraphColumn value={`${row.original.paidEmis}/${getValue()}`} />
    ),
  },
  {
    header: "EMI Amount",
    accessorKey: "emiAmount",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Pending Amount",
    accessorKey: "pendingAmount",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Received Amount",
    accessorKey: "paymentsReceived",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Recovery Date",
    accessorKey: "installmentDate",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
    ),
  },
  {
    header: "Loan Start Date",
    accessorKey: "startDate",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
    ),
  },
  {
    header: "Loan End Date",
    accessorKey: "endDate",
    cell: ({ getValue }) => (
      <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
    ),
  },
  {
    header: "Charges",
    accessorKey: "totalLateCharges",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Total Profit",
    accessorKey: "profit",
    cell: ({ getValue }) => <SingleParagraphColumn value={getValue()} />,
  },
  {
    header: "Status ",
    accessorKey: "status",
    cell: ({ getValue }) => <Status text={getValue()} />,
  },
  {
    header: "Pay",
    accessorKey: "emi",
    cell: ({ row }) => (
      <LoadingButton
        isLoading={false}
        disabled={row.original.status !== "Active"}
        onClick={() => handlePayEmi(row?.original)}
      >
        Pay EMI
      </LoadingButton>
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <ActionColumnsComponent
        showViewButton={true}
        showDeleteButton={true}
        showEditLink={true}
        editOnLink={`/loan/edit/${row.original.id}`}
        viewOnClick={() => {
          handleViewLoan(row?.original);
        }}
        deleteOnClick={() => handleDelete(row?.original)}
      />
    ),
  },
];

const CustomerLoan = (permissions) => {
  const create = true;
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { confirm, ModalContent } = ConfirmationModal();
  const [openViewDetailModal, setOpenViewDetailModal] = useState(false);
  const [openReceivedMoneyModal, setOpenReceivedMoneyModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const pagination = useSelector(selectCustomerLoanPagination);
  const customerLoanList = useSelector(selectAllCustomerLoanList);
  const customerLoanSearchData = useSelector(selectCustomerLoanSearchData);

  const searchFields = [
    {
      name: "search",
      placeholder: "Customer",
      onChange: (e) => {
        const value = e.target.value;
        dispatch(
          setCustomerLoanSearchData({
            ...customerLoanSearchData,
            search: value,
          })
        );
      },
    },
  ];

  const handleAddNewCustomerLoan = () => {
    navigate.push("/loan/add");
  };
  const handleViewLoan = (rowData) => {
    setRowData(rowData);
    setOpenViewDetailModal(true);
  };
  const handlePayEmi = (rowData) => {
    setRowData({
      id: rowData?.customer?.id,
      firstName: rowData?.customer?.firstName,
      lastName: rowData?.customer?.lastName,
      loans: [
        {
          installmentDate: rowData?.installmentDate,
          nextEmiAmount: rowData?.nextEmiAmount,
        },
      ],
    });
    setOpenReceivedMoneyModal(true);
  };
  const handleDelete = async (rowData) => {
    const isConfirmed = await confirm({
      title: "",
      message:
        "Are you sure you want to delete this Loan? Once deleted, it cannot be restored.",
      icon: "delete",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    dispatch(
      deleteCustomerLoan({
        id: rowData?.id,
        onSuccess: (response) => {
          getAllCustomerLoansList(customerLoanSearchData, pagination);
          toast.success(response?.message);
        },
        onFailure: () => {},
      })
    );
  };

  const handleRefrsh = () => {
    dispatch(setCustomerLoanPagination({ pageIndex: 0, pageSize: 10 }));
    dispatch(setCustomerLoanSearchData({ search: "" }));
  };

  //   Apis Functions
  const getAllCustomerLoansList = (customerLoanSearchData, pagination) => {
    dispatch(
      getAllCustomerLoans({
        data: {
          page: pagination?.pageIndex + 1,
          limit: pagination?.pageSize,
          search: customerLoanSearchData?.search,
        },
        onSuccess: ({ message, data }) => {
          console.log(message);
          dispatch(setAllCustomerLoanList(data));
        },
        onFailure: () => {},
      })
    );
  };

  useEffect(() => {
    getAllCustomerLoansList(customerLoanSearchData, pagination);
  }, [customerLoanSearchData, pagination]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 justify-between  p-4">
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <TitleAndDescription
            title="CustomerLoans"
            description="Manage your customerLoans"
          />
          {/* Create Button */}
          <div>
            <LoadingButton
              name={"addCustomerLoan"}
              type={"button"}
              isLoading={false}
              disabled={false}
              onClick={handleAddNewCustomerLoan}
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
                  placeholder={`Search by ${field?.placeholder}`}
                  className="pl-10"
                  onChange={field?.onChange}
                  value={customerLoanSearchData?.[field.name] ?? ""}
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
            columns={columns(handleDelete, handleViewLoan, handlePayEmi)}
            data={customerLoanList?.loans || []}
            pagination={pagination}
            setPagination={(newPagination) =>
              dispatch(setCustomerLoanPagination(newPagination))
            }
            totalRows={customerLoanList?.total}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {ModalContent}

      {/* loan Detail modal */}
      <LoanDetailModal
        openModal={openViewDetailModal}
        onBack={() => {
          setRowData({});
          setOpenViewDetailModal(false);
        }}
        callBackFunc={() => {
          getAllCustomerLoansList(customerLoanSearchData, pagination);
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
          getAllCustomerLoansList(customerLoanSearchData, pagination);
        }}
      />
    </>
  );
};
export default CustomerLoan;
