"use client";

import React from "react";
import { ConfigProvider } from "antd";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
