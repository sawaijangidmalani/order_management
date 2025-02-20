import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./Header/Header";
import Login from "./Login-Form/Login";
import Signin from "./Login-Form/Signin";
import ForgotPassword from "./Login-Form/ForgotPassword";
import ApplayOut from "./pages/AppLayOut";
import Dashboard from "./Dashboard/Dashboard";
import ManageCustomer from "./Customers/ManageCustomer";
import ManageSuppliers from "./Suppliers/ManageSuppliers";
import ManageItem from "./Item-Master/ManageItem";
import ManagePurchase from "./Purchase-Order/ManagePurchase";
import GlobalStyle from "./GlobalStyled";
import ItemPrice from "./Item-Master/ItemPrice";
import Home from "./pages/Home";
import ManageCPO from "./Sales-Order/ManageCPO";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/auth";

function App() {
  return (
    <AuthProvider>
      {" "}
      <BrowserRouter>
        <GlobalStyle />
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/" element={<ApplayOut />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customer" element={<ManageCustomer />} />
            <Route path="/suppliers" element={<ManageSuppliers />} />
            <Route path="/items" element={<ManageItem />} />
            <Route path="/items/itemprice" element={<ItemPrice />} />
            <Route path="/sales" element={<ManageCPO />} />
            <Route path="/purchaseorder" element={<ManagePurchase />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
