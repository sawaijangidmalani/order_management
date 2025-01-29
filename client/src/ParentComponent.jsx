import React, { useState } from "react";
import SalesOrder from "./Sales-Order/SalesOrder";
import ManageCustomer from "./Customers/ManageCustomer";



const ParentComponent = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Admin",
      email: "admin@admin.com",
      phone: 123456789,
      area: "ahm",
      status: "active",
    },
    {
      id: 2,
      name: "Test",
      email: "test@test.com",
      phone: 9876543210,
      area: "ahm",
      status: "active",
    },
  ]);

  return (
    <div>
      <ManageCustomer customers={customers} setCustomers={setCustomers} />
      <SalesOrder customers={customers} />
    </div>
  );
};

export default ParentComponent;
