import { BiLogOutCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import "./index.css";
import { FaUser } from "react-icons/fa";

function Navbar1() {
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
          <FaUser /> Shark Bytes
        </h2>
        <Tooltip title="Logout">
          <Link to="/">
            <BiLogOutCircle className="logout-icon" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}

export default Navbar1;
