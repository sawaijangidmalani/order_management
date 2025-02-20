import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../src/Style/Navbar.css"

function Navbar() {
  return (
    <>
      <div className="navbar1">
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2>
              <span className="span">
                <img src="home.svg" alt="home icon" />
              </span>
              Order Management
            </h2>
          </Link>
        </div>

        <div className="signup">
          <Link to="/signin" style={{ textDecoration: "none" }}>
            <h2>
              <FaUserPlus />
              Sign Up
            </h2>
          </Link>
          
        </div>
      </div>
    </>
  );
}

export default Navbar;
