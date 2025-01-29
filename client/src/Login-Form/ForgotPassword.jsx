import { useState } from "react";
import { Link } from "react-router-dom"; 
import Header from "../Header/Header";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/auth/forgotPassword", { email });
      console.log(data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <div className="login">
      <Header />
      <form onSubmit={handleSubmit} className="form">
        <h2>Forgot Password</h2>
        <div className="input-groups">
          {!submitted ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <button type="submit">Submit</button>
            </>
          ) : (
            <p>
               <Link to="/">Login</Link>
              The password has been sent to your email address.If an issue occurs,kindly try again
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
