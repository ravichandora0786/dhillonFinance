// app/layout.tsx
"use client";
import "./globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import App from "@/components/window";
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
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
