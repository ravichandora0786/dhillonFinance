"use client";
import SignIn from "@/components/auth/signIn";
import React, { useEffect, useState } from "react";

const login = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return <SignIn />;
};
export default login;
