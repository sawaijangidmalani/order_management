import Login from "../Login-Form/Login";
import Navbar from "../Navbar";


const Header = () => {
  return (
    <div>
      <Navbar/>
      <div className="container shadow">
      <img
        src="login-v2.svg"
        alt="imges logo"
        style={{ width: "60%", height: "60vh", }}
      ></img>
      </div>
    </div>
  );
};

export default Header;
