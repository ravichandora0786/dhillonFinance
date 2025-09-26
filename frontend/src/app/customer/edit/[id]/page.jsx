"use client";

import React from "react";
import AddEditCustomerComponent from "@/components/ui/pagesComponents/addEditCustomerComponent";
import { useParams } from "next/navigation";

export default function AddEditCustomer() {
  const params = useParams();
  const id = params.id;
  return <AddEditCustomerComponent customerId={id} isEdit={true} />;
}
