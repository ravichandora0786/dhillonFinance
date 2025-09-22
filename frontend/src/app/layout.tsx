// app/layout.tsx
"use client";
import "./globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import App from "@/components/window"; // Your App component with Sidebar
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SocketProvider>
              <App>{children}</App>
            </SocketProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
