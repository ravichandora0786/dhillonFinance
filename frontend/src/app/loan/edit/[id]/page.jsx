"use client";

import React from "react";
import AddEditCustomerLoanComponent from "@/components/ui/pagesComponents/addEditLoanComponent";
import { useParams } from "next/navigation";

export default function AddEditCustomerLoan() {
  const params = useParams();
  const id = params.id;
  return <AddEditCustomerLoanComponent customerLoanId={id} isEdit={true} />;
}
