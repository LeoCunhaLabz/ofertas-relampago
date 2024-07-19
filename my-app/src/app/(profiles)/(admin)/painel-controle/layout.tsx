import React from 'react';
import { Header } from "@/components/HeaderAdmin";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;