// import React, { useState, useEffect } from "react";
// import styled from "styled-components";

// const StyledDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   width: 40rem;  
// `;

// const StyledLabel = styled.label`
//   font-size: 16px;
// `;

// const StyledInput = styled.input`
//   width: 100%;
//   height: 4rem;
//   padding: 10px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   font-size: 16px;
// `;

// const StyledSelect = styled.select`
//   width: 100%;
//   height: 4rem;
//   padding: 8px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   font-size: 16px;
// `;

// const StyledButton = styled.button`
//   padding: 10px;
//   font-size: 16px;
//   color: white;
//   background-color: #4e647b;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   margin-right: 10px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const EditPurchaseOrder = ({ suppliers, purchaseOrders, customerPOs, initialData, onSave, onCancel }) => {
//   const [supplier, setSupplier] = useState(initialData.supplier || "");
//   const [purchaseOrder, setPurchaseOrder] = useState(initialData.purchaseOrder || "");
//   const [customerpo, setCustomerpo] = useState(initialData.customerpo || "");
//   const [date, setDate] = useState(initialData.date || "");
//   const [total, setTotal] = useState(initialData.total || "");
//   const [status, setStatus] = useState(initialData.status || "");

//   useEffect(() => {
//     if (initialData) {
//       setSupplier(initialData.supplier);
//       setPurchaseOrder(initialData.purchaseOrder);
//       setCustomerpo(initialData.customerpo);
//       setDate(initialData.date);
//       setTotal(initialData.total);
//       setStatus(initialData.status);
//     }
//   }, [initialData]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const updatedData = {
//       supplier,
//       purchaseOrder,
//       customerpo,
//       date,
//       total,
//       status,
//     };
//     onSave(updatedData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <StyledDiv>
//         <StyledLabel>Supplier</StyledLabel>
//         <StyledSelect value={supplier} onChange={(e) => setSupplier(e.target.value)}>
//           {suppliers.map((supplier) => (
//             <option key={supplier.id} value={supplier.name}>
//               {supplier.name}
//             </option>
//           ))}
//         </StyledSelect>

//         <StyledLabel>Purchase Order</StyledLabel>
//         <StyledSelect value={purchaseOrder} onChange={(e) => setPurchaseOrder(e.target.value)}>
//           {purchaseOrders.map((po) => (
//             <option key={po} value={po}>
//               {po}
//             </option>
//           ))}
//         </StyledSelect>

//         <StyledLabel>Customer PO</StyledLabel>
//         <StyledSelect value={customerpo} onChange={(e) => setCustomerpo(e.target.value)}>
//           {customerPOs.map((cpo) => (
//             <option key={cpo} value={cpo}>
//               {cpo}
//             </option>
//           ))}
//         </StyledSelect>

//         <StyledLabel>Date</StyledLabel>
//         <StyledInput
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <StyledLabel>Total</StyledLabel>
//         <StyledInput
//           type="text"
//           value={total}
//           onChange={(e) => setTotal(e.target.value)}
//         />

//         <StyledLabel>Status</StyledLabel>
//         <StyledInput
//           type="text"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         />

//         <div>
//           <StyledButton type="submit">Save</StyledButton>
//           <StyledButton type="button" onClick={onCancel}>
//             Cancel
//           </StyledButton>
//         </div>
//       </StyledDiv>
//     </form>
//   );
// };

// export default EditPurchaseOrder;
