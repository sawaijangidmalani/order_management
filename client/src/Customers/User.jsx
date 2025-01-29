
// // import React, { useState, useEffect } from "react";
// // import styled from "styled-components";
// // import PurchaseOrder from "./PurchaseOrder";
// // import EditPurchaseOrder from "./EditPurchaseOrder";
// // import { BiEdit, BiTrash } from "react-icons/bi";

// // const initialCustomers = [
// //   {
// //     id: 1,
// //     name: "Admin",
// //     email: "supplier1@example.com",
// //     phone: "123-456-7890",
// //     area: "Area 1",
// //     status: "Active",
// //   },
// //   {
// //     id: 2,
// //     name: "Test",
// //     email: "supplier2@example.com",
// //     phone: "234-567-8901",
// //     area: "Area 2",
// //     status: "Inactive",
// //   },
// // ];

// // const initialPurchaseOrders = ["PO 01", "PO 02", "PO 03"];
// // const initialCustomerPOs = ["CPO 001", "CPO 002", "CPO 003"];

// // const Modal = styled.div`
// //   position: absolute;
// //   top: 50%;
// //   left: 50%;
// //   transform: translate(-50%, -50%);
// //   background-color: white;
// //   padding: 20px;
// // `;

// // const StyledModel = styled.div`
// //   position: fixed;
// //   top: 0;
// //   left: 0;
// //   width: 100%;
// //   height: 100vh;
// //   background-color: none;
// //   backdrop-filter: blur(2px);
// // `;

// // const StyledDiv = styled.div`
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;
// // `;

// // const StyledSelect = styled.select`
// //   width: 200px;
// //   height: 40px;
// //   background-color: white;
// //   color: #333;
// //   padding-left: 10px;
// //   font-size: 16px;
// //   border: none;
// //   border-radius: 5px;
// //   margin: 10px;
// //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// // `;

// // const StyledLabel = styled.label`
// //   font-size: 16px;
// //   margin: 10px;
// // `;

// // const StyledInput = styled.input`
// //   width: 200px;
// //   height: 40px;
// //   background-color: white;
// //   color: #333;
// //   padding-left: 10px;
// //   font-size: 16px;
// //   border: none;
// //   border-radius: 5px;
// //   margin: 10px;
// //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// // `;

// // const ButtonContainer = styled.div`
// //   display: flex;
// //   justify-content: space-around;
// //   padding: 20px;
// //   gap: 15px;
// // `;

// // const StyledButton = styled.button`
// //   font-size: 16px;
// //   color: #ffffff;
// //   background-color: #4e647b;
// //   border: none;
// //   padding: 10px;
// //   border-radius: 5px;
// //   cursor: pointer;
// //   transition: background-color 0.3s ease;

// //   &:hover {
// //     background-color: #0056b3;
// //   }

// //   &:focus {
// //     outline: none;
// //   }
// // `;

// // const DropdownContainer = styled.div`
// //   position: relative;
// // `;

// // const DropdownButton = styled.button`
// //   width: 200px;
// //   height: 40px;
// //   background-color: white;
// //   color: #333;
// //   padding-left: 10px;
// //   font-size: 16px;
// //   border: none;
// //   border-radius: 5px;
// //   margin: 10px;
// //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// //   text-align: left;
// //   cursor: pointer;

// //   &:focus {
// //     outline: none;
// //   }
// // `;

// // const DropdownOptions = styled.div`
// //   position: absolute;
// //   width: 200px;
// //   max-height: 150px;
// //   overflow-y: auto;
// //   background-color: white;
// //   border: 1px solid #ddd;
// //   border-radius: 5px;
// //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// //   z-index: 1;
// // `;

// // const Option = styled.div`
// //   padding: 10px;
// //   cursor: pointer;

// //   &:hover {
// //     background-color: #f0f0f0;
// //   }
// // `;

// // function ManagePurchase() {
// //   const [suppliers, setSuppliers] = useState(initialSuppliers);
// //   const [purchaseOrders] = useState(initialPurchaseOrders);
// //   // const [customerPOs] = useState(initialCustomerPOs);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedDate, setSelectedDate] = useState("");
// //   const [purchaseData, setPurchaseData] = useState([
// //     {
// //       customer: "Admin",
// //       purchaseOrder: "PO 01",
// //       customerpo: "CPO 001",
// //       date: "08/05/2024",
// //       total: "24000",
// //       status: "active",
// //     },
// //     {
// //       customer: "Test",
// //       purchaseOrder: "PO 02",
// //       customerpo: "CPO 002",
// //       date: "09/05/2024",
// //       total: "550000",
// //       status: "inactive",
// //     },
// //   ]);
// //   const [selectedPurchaseIndex, setSelectedPurchaseIndex] = useState(null);
// //   const [editModalVisible, setEditModalVisible] = useState(false);
// //   const [selectedPurchaseData, setSelectedPurchaseData] = useState(null);
// //   const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.name);
// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const [customerPOs, setCustomerPOs] = useState(initialCustomerPOs);
// //   const [selectedCustomerPO, setSelectedCustomerPO] = useState(customerPOs[0]);
// //   const [customers, setCustomers] = useState(initialCustomers);
// //   const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   useEffect(() => {
// //     const storedPurchaseData = localStorage.getItem("purchaseData");
// //     if (storedPurchaseData) {
// //       setPurchaseData(JSON.parse(storedPurchaseData));
// //     }
// //   }, []);

// //   useEffect(() => {
// //     localStorage.setItem("purchaseData", JSON.stringify(purchaseData));
// //   }, [purchaseData]);

// //   const handleDateChange = (event) => {
// //     setSelectedDate(event.target.value);
// //   };

// //   const handleSearch = () => {
// //     // Implement search functionality here
// //   };

// //   const handlePurchaseOrder = () => {
// //     setShowModal(true);
// //   };

// //   const handlePurchaseData = (data) => {
// //     if (selectedPurchaseIndex !== null) {
// //       const updatedPurchaseData = [...purchaseData];
// //       updatedPurchaseData[selectedPurchaseIndex] = data;
// //       setPurchaseData(updatedPurchaseData);
// //       setSelectedPurchaseIndex(null);
// //     } else {
// //       setPurchaseData([...purchaseData, data]);
// //     }
// //     setShowModal(false);
// //     setEditModalVisible(false);
// //   };

// //   const handleEdit = (index) => {
// //     setSelectedPurchaseIndex(index);
// //     setSelectedPurchaseData(purchaseData[index]);
// //     setEditModalVisible(true);
// //   };

// //   const handleDelete = (index) => {
// //     const updatedPurchaseData = [...purchaseData];
// //     updatedPurchaseData.splice(index, 1);
// //     setPurchaseData(updatedPurchaseData);
// //   };

// //   const handleCancelEdit = () => {
// //     setEditModalVisible(false);
// //     setSelectedPurchaseIndex(null);
// //     setSelectedPurchaseData(null);
// //   };

// //   const toggleDropdown = () => {
// //     setDropdownOpen(!dropdownOpen);
// //   };

// //   const handleOptionClick = (option) => {
// //     setSearchTerm(option);
// //     setDropdownOpen(false);
// //   };

// //   const toggleDropdownCustomerPO = () => {
// //     setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);
// //   };

// //   const handleCustomerPOSelect = (customerPO) => {
// //     setSelectedCustomerPO(customerPO);
// //     setDropdownOpenCustomerPO(false);
// //   };

// //   return (
// //     <>
// //       <h1>Manage Purchases</h1>
// //       <StyledDiv>
// //         <DropdownContainer>
// //           <DropdownButton onClick={toggleDropdown}>
// //             {selectedCustomer || "Customer Name"}
// //           </DropdownButton>
// //           {dropdownOpen && (
// //             <DropdownOptions>
// //               {customers.map((customer) => (
// //                 <Option
// //                   key={customer.id}
// //                   onClick={() => handleOptionClick(customer.name)}
// //                 >
// //                   {customer.name}
// //                 </Option>
// //               ))}
// //             </DropdownOptions>
// //           )}
// //         </DropdownContainer>
// //         <StyledLabel htmlFor="orderDate">Order Date:</StyledLabel>
// //         <StyledInput
// //           type="date"
// //           id="orderDate"
// //           value={selectedDate}
// //           onChange={handleDateChange}
// //         />
// //         <DropdownContainer>
// //           <DropdownButton onClick={toggleDropdownCustomerPO}>
// //             {selectedCustomerPO || "Customer PO"}
// //           </DropdownButton>
// //           {dropdownOpenCustomerPO && (
// //             <DropdownOptions>
// //               {customerPOs.map((customerPO, index) => (
// //                 <Option
// //                   key={index}
// //                   onClick={() => handleCustomerPOSelect(customerPO)}
// //                 >
// //                   {customerPO}
// //                 </Option>
// //               ))}
// //             </DropdownOptions>
// //           )}
// //         </DropdownContainer>
// //         <ButtonContainer>
// //           <StyledButton onClick={handleSearch}>Search</StyledButton>
// //           <StyledButton onClick={handleSaleOrder}>Add Customer PO</StyledButton>
// //         </ButtonContainer>
// //         <StyledSelect>
// //           <option>PO 1</option>
// //           <option>PO 2</option>
// //           <option>PO 3</option>
// //         </StyledSelect>

// //         {/* <StyledSelect>
// //           <option>CPO 001</option>
// //           <option>CPO 002</option>
// //           <option>CPO 003</option>
// //         </StyledSelect> */}
// //         <ButtonContainer>
// //           <StyledButton onClick={handleSearch}>Search</StyledButton>
// //           <StyledButton onClick={handlePurchaseOrder}>
// //             Add Purchase Order
// //           </StyledButton>
// //         </ButtonContainer>
// //       </StyledDiv>
// //       <div>
// //         <h3>Purchase List:</h3>
// //         <table className="table table-bordered table-striped">
// //           {" "}
// //           <thead className="table-secondary">
// //             <tr>
// //               <th>Customer Name</th>
// //               <th>Purchase Order </th>
// //               <th>Customer PO</th>
// //               <th>Date</th>
// //               <th>Total Purchase</th>
// //               <th>Status</th>
// //               <th>Action</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {purchaseData.map((purchase, index) => (
// //               <tr key={index}>
// //                 <td>{purchase.customer}</td>
// //                 <td>{purchase.purchaseOrder}</td>
// //                 <td>{purchase.customerpo}</td>
// //                 <td>{purchase.date}</td>
// //                 <td>{purchase.total}</td>
// //                 <td>{purchase.status}</td>
// //                 <td>
// //                   <div className="buttons-group">
// //                     <button onClick={() => handleEdit(index)} className="btns">
// //                       <BiEdit />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(index)}
// //                       className="btns"
// //                     >
// //                       <BiTrash />
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //       {showModal && (
// //         <StyledModel>
// //           <Modal>
// //             <PurchaseOrder
// //               onPurchaseData={handlePurchaseData}
// //               purchaseData={
// //                 selectedPurchaseIndex !== null
// //                   ? purchaseData[selectedPurchaseIndex]
// //                   : null
// //               }
// //             />
// //           </Modal>
// //         </StyledModel>
// //       )}
// //       {editModalVisible && selectedPurchaseData && (
// //         <StyledModel>
// //           <Modal>
// //             <EditPurchaseOrder
// //               suppliers={suppliers}
// //               purchaseOrders={purchaseOrders}
// //               customerPOs={customerPOs}
// //               initialData={selectedPurchaseData}
// //               onSave={handlePurchaseData}
// //               onCancel={handleCancelEdit}
// //             />
// //           </Modal>
// //         </StyledModel>
// //       )}
// //     </>
// //   );
// // }

// // export default ManagePurchase;



// const DropdownContainer = styled.div`
//   position: relative;
// `;

// const DropdownButton = styled.button`
//   width: 200px;
//   height: 40px;
//   background-color: white;
//   color: #333;
//   padding-left: 10px;
//   font-size: 16px;
//   border: none;
//   border-radius: 5px;
//   margin: 10px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   text-align: left;
//   cursor: pointer;

//   &:focus {
//     outline: none;
//   }
// `;

// const DropdownOptions = styled.div`
//   position: absolute;
//   width: 200px;
//   max-height: 150px;
//   overflow-y: auto;
//   background-color: white;
//   border: 1px solid #ddd;
//   border-radius: 5px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   z-index: 1;
// `;

// const Option = styled.div`
//   padding: 10px;
//   cursor: pointer;

//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

// const [dropdownOpenSupplier, setDropdownOpenSupplier] = useState(false);
// const [dropdownOpenPurchaseOrder, setDropdownOpenPurchaseOrder] = useState(false);
// const [dropdownOpenCustomerPO, setDropdownOpenCustomerPO] = useState(false);

// const toggleDropdownSupplier = () => {
//   setDropdownOpenSupplier(!dropdownOpenSupplier);
// };

// const handleSupplierSelect = (supplier) => {
//   setSelectedSupplier(supplier);
//   setDropdownOpenSupplier(false);
// };

// const toggleDropdownPurchaseOrder = () => {
//   setDropdownOpenPurchaseOrder(!dropdownOpenPurchaseOrder);
// };

// const handlePurchaseOrderSelect = (purchaseOrder) => {
//   setSelectedPurchaseOrder(purchaseOrder);
//   setDropdownOpenPurchaseOrder(false);
// };

// const toggleDropdownCustomerPO = () => {
//   setDropdownOpenCustomerPO(!dropdownOpenCustomerPO);
// };

// const handleCustomerPOSelect = (customerPO) => {
//   setSelectedCustomerPO(customerPO);
//   setDropdownOpenCustomerPO(false);
// };


import { Link } from "react-router-dom";
import AddNewCustomer from "./AddNewCustomer";

function User() {
  return (
    <>
      <div>
        <div className="navbr1">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2 className="logo">Inventory Purchase</h2>
          </Link>
          <nav className="cadd">
            <Link to="/">Logout</Link>
          </nav>
        </div>
        <AddNewCustomer />
      </div>
    </>
  );
}
export default User;