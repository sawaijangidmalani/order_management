// import { BiPurchaseTag } from "react-icons/bi";
// import { CgNotes } from "react-icons/cg";
// import { FaPaintBrush, FaStore } from "react-icons/fa";
// import { FaPeopleCarryBox } from "react-icons/fa6";
// import { RiDashboard2Fill } from "react-icons/ri";
// import { SiSalesforce } from "react-icons/si";
// import { NavLink} from "react-router-dom";
// import styled from "styled-components";
// import Navbar1 from "../Navbar1";

// const NavList = styled.ul`
//   display: flex;
//   flex-direction: column;
//   gap: 0.9rem;
//   margin-top: 25px;
//   @media screen {
//       max-width: 100%;
//   }
// `;

// const StyledNavLink = styled(NavLink)`
//   &:link,
//   &:visited {
//     display: flex;
//     align-items: center;
//     gap: 1.2rem;
//     color: var(--color-grey-800);
//     font-size: 1.5rem;
//     color: #b4c2c1;
//     font-weight: 600;
//     padding: 1.2rem 2.4rem;
//     transition: all 0.3s;
//     text-decoration: none;
//   }

//   &:active,
//   &.active:link,
//   &.active:visited {
//     color: var(--color-grey-600);
//     background-color: var(--color-grey-50);
//     border-radius: var(--border-radius-sm);
//   }

//   & svg {
//     width: 2.4rem;
//     height: 2.4rem;
//     color: var(--color-grey-400);
//     transition: all 0.3s;
//   }

//   &:hover svg,
//   &:active svg,
//   &.active:link svg,
//   &.active:visited svg {
//     color: var(--color-brand-600);
//   }
// `;
// function MainPage(){

//   return(
//   <>

//   <NavList>
//     <li><StyledNavLink to="/dashboard"> <RiDashboard2Fill/> Dashboard</StyledNavLink></li>
//     <li><StyledNavLink to="/customer"> <FaPeopleCarryBox/> Customer</StyledNavLink></li>
//     <li><StyledNavLink to="/suppliers"> <CgNotes/> Suppliers</StyledNavLink></li>
//     <li><StyledNavLink to="/items"> <FaPaintBrush/> Items Master</StyledNavLink></li>
//     <li><StyledNavLink to="/sales"> <SiSalesforce/> Customer PO</StyledNavLink></li>
//     <li><StyledNavLink to="/purchaseorder"> <BiPurchaseTag/> Purchase Order</StyledNavLink></li>
//     <li><StyledNavLink to="/itemstock"> <FaStore/> Item Stock Master</StyledNavLink></li>
//   </NavList>

//   </>)
// }
// export default MainPage;

import "../Style/Main.css";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaTruck,
  FaBoxes,
  FaFileInvoice,
  FaShoppingCart,
} from "react-icons/fa";

function MainPage() {
  return (
    <ul className="nav-list">
      <li>
        <NavLink className="nav-link" to="/dashboard">
          <FaTachometerAlt /> Dashboard{" "}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/customer">
          <FaUser /> Customer{" "}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/suppliers">
          {" "}
          <FaTruck /> Suppliers{" "}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/items">
          {" "}
          <FaBoxes /> Items Master{" "}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/sales">
          {" "}
          <FaFileInvoice /> Customer PO{" "}
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/purchaseorder">
          {" "}
          <FaShoppingCart /> Purchase Order{" "}
        </NavLink>
      </li>
    </ul>
  );
}

export default MainPage;
