"use client";

import React from "react";
import AddEditCustomerLoanComponent from "@/components/ui/pagesComponents/addEditLoanComponent";
import { useSearchParams } from "next/navigation";

export default function AddCustomerLoan() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId") || null;
  return (
    <AddEditCustomerLoanComponent
      customerLoanId={null}
      isEdit={false}
      customerId={customerId}
    />
  );
}
