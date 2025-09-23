"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import socketio from "socket.io-client";
import  store  from "@/redux/store";
import PropTypes from "prop-types";

const getSocket = () => {
  const token = store.getState().common.accessToken;
  return socketio(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9000", {
    auth: { token },
  });
};

const SocketContext = createContext({ socket: null });

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={useMemo(() => ({ socket }), [socket])}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = { children: PropTypes.node.isRequired };
export { SocketProvider, SocketContext };
