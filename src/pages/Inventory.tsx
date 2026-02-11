import React from "react";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const Inventory: React.FC = () => {
  return (
    <>
      <PageBreadcrumb pageName="Inventory" />
      <InventoryManagement />
    </>
  );
};

export default Inventory;
