"use client";

import React from "react";
import AddEditUserComponent from "@/components/ui/pagesComponents/addEditUserComponent";
import { useParams } from "next/navigation";

export default function EditUser() {
  const params = useParams();
  const id = params.id;
  return <AddEditUserComponent userId={id} isEdit={true} />;
}
