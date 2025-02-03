import { BiLogOutCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FaUser } from "react-icons/fa";
import { useAuth } from "./context/auth";
import "./index.css";

function Navbar1() {
  const { auth, setAuth } = useAuth();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth({ user: null, token: "" });
  };

  return (
    <div className="navbar1">
      <div>
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <h2>
            <span className="span">
              <img src="home.svg" alt="home icon" />
            </span>
            Order Management
          </h2>
        </Link>
      </div>

      <div className="logout">
        <h2>
          <FaUser /> {auth?.user?.name || "Guest"}
        </h2>
        <Tooltip title="Logout">
          <Link to="/" onClick={handleLogout}>
            <BiLogOutCircle className="logout-icon" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}

export default Navbar1;
