import { useContext } from "react";
import { SocketContext } from "@/context/SocketContext";

// Custom hook to access the socket instance from the context

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
