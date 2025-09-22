"use client";

import React from "react";

import AddEditStudent from "@/components/ui/pagesComponents/students/addEditStudentComponent";
import { useParams } from "next/navigation";

export default function EditStudent() {
  const params = useParams();
  const studentId = params.id;
  return <AddEditStudent studentId={studentId} isEdit={true} />;
}
