import styled from "styled-components";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
import Navbar1 from "../Navbar1";

const StyledApplay = styled.div`
  display: grid;
  grid-template-columns: 25rem 1fr;
  height: 90vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const Main = styled.main`
  background-color: #f4efef;
  padding: 4rem 4.8rem 6.4rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Container = styled.div`
  /* max-width: 150rem; */
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 1rem;
  }
`;

function ApplayOut() {
  return (
    <>
      <Navbar1 />
      <StyledApplay>
        <Sidebar />
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledApplay>
    </>
  );
}

export default ApplayOut;
