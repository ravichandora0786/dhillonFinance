import React, { useState } from "react";
import { removeTimeFromDate } from "@/Services/utils";
import SingleParagraphColumn from "@/components/tableCollumnComponents/singleParagraphCol";
import DataTableComponent from "@/components/dataTableComponent";
import ActionColumnsComponent from "@/components/tableCollumnComponents/actionColumn";
import EditTransactionModal from "@/components/ui/pagesComponents/editTransationComponent";
import { LoanFields } from "@/constants/fieldsName";

const LoanTransactionTable = ({
  transactions = [],
  callBackFunc,
  loanData,
}) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [editTransationModal, setEditTransationModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const columns = [
    {
      header: "Date",
      accessorKey: "transactionDate",
      cell: ({ getValue }) => (
        <SingleParagraphColumn value={removeTimeFromDate(getValue())} />
      ),
    },
    {
      header: "Type",
      accessorKey: "transactionType",
      cell: ({ row, getValue }) => {
        const type = row.original.transactionType;
        const colorClass =
          type === "Disbursement"
            ? "text-red-500 font-semibold"
            : "text-green-600 font-semibold";

        return (
          <SingleParagraphColumn
            value={`${getValue()}`}
            className={colorClass}
          />
        );
      },
    },
    {
      header: "Payment Mode",
      accessorKey: "paymentMode",
      cell: ({ getValue }) => (
        <SingleParagraphColumn value={getValue() || "-"} />
      ),
    },
    {
      header: "Amount (₹)",
      accessorKey: "amount",
      cell: ({ row, getValue }) => {
        const type = row.original.transactionType;
        const colorClass =
          type === "Disbursement"
            ? "text-red-500 font-semibold"
            : "text-green-600 font-semibold";

        return (
          <SingleParagraphColumn
            value={`₹ ${getValue()}`}
            className={colorClass}
          />
        );
      },
    },
    {
      header: "Late EMI Days",
      accessorKey: "lateEMIDays",
      cell: ({ getValue }) => (
        <SingleParagraphColumn value={`${getValue() || 0}`} />
      ),
    },
    {
      header: "Late EMI Charges (₹)",
      accessorKey: "lateEMICharges",
      cell: ({ row, getValue }) => {
        const type = row.original.transactionType;
        const colorClass =
          type === "Disbursement"
            ? "text-red-500 font-semibold"
            : "text-green-600 font-semibold";

        return (
          <SingleParagraphColumn
            value={`₹ ${getValue()}`}
            className={colorClass}
          />
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ getValue }) => (
        <SingleParagraphColumn value={getValue() || "-"} />
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <ActionColumnsComponent
          showEditButton={row.original.transactionType !== "Disbursement"}
          editOnClick={() => handleEdit(row?.original)}
        />
      ),
    },
  ];

  const handleEdit = (rowData) => {
    if (rowData.id) {
      setRowData(rowData);
      setEditTransationModal(true);
    }
  };

  return (
    <>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-700 mb-2">
          Transactions
        </div>
        <DataTableComponent
          columns={columns}
          data={transactions}
          pagination={pagination}
          setPagination={(newPagination) =>
            dispatch(setPagination(newPagination))
          }
          totalRows={pagination?.pageSize}
        />
      </div>
      <EditTransactionModal
        openModal={editTransationModal}
        onBack={() => {
          setRowData({});
          setEditTransationModal(false);
        }}
        data={rowData}
        callBackFunc={() => {
          callBackFunc();
        }}
        isEdit={true}
        installmentDate={loanData?.[LoanFields.PAY_INSTALLMENT_DATE]}
      />
    </>
  );
};

export default LoanTransactionTable;
