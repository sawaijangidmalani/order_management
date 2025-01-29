import styled from "styled-components";
import MainPage from "./MainPage";

const StyledSide = styled.aside`
      background-color: #124E80;
      padding: 3.2rem 2.4rem;
      border-right: 1px solid lightgray;
      grid-row: 1/ -1;
      display: flex;
      flex-direction: column;
      gap: 3.2rem;
`

function Sidebar(){
      return (
            <>
            
            <StyledSide>
                  <MainPage/>
            </StyledSide>
            
            </>
      )
}
export default Sidebar;



// import "../Style/Main.css";
// import MainPage from "./MainPage";

// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <MainPage />
//     </aside>
//   );
// }

// export default Sidebar;