import { useState, useEffect } from "react";

function AddCustomer() {
      const initialFormData = {
            fname: "",
            email: "",
            phone: "",
            area: "",
            status: "",
      }
  const [name, setName] = useState({...initialFormData});
  const [error, setError] = useState({...initialFormData});
  useEffect(() => {
    setName({  ...initialFormData });
  }, []);

  const validForm = () => {
    let valid = true;
    const newError = { ...error };
    if (name.fname.trim() === "") {
      newError.fname = "*Name is required";
      valid = false;
    } else {
      newError.email = "";
    }
    if (name.email.trim() === "") {
      newError.email = "*Email is required";
      valid = false;
    } else {
      newError.email = "";
    }
    if (name.phone.trim() === "") {
      newError.phone = "*Phone is required";
      valid = false;
    } else {
      newError.phone = "";
    }
    setError(newError);
    return valid;
  };

  const inputEvent = (e) => {
    const { value, name: inputName } = e.target;
    setName((preValue) => ({
      ...preValue,
      [inputName]: value,
    }));
  };

  const [records, setRecords] = useState([]);

  const onSubmits = (e) => {
    e.preventDefault();
    const newRecord = { ...name, id: new Date().getTime().toString() };
    setRecords([...records, newRecord]);
    console.log(setRecords);
    console.log("Login with", name);
    if (validForm()) {
      alert("Success!!!!");
      setName({...initialFormData });
    }
  };

  return (
    <div>
      <form onSubmit={onSubmits} className="form" style={{position:"absolute", zIndex:"1000"}}>
        <h2>Sign-in</h2>
        <div className="input-group">
          <div>
            <input
              type="text"
              placeholder="fname"
              name="fname"
              onChange={inputEvent}
              value={name.fname}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={inputEvent}
              value={name.email}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="phone"
              name="phone"
              onChange={inputEvent}
              value={name.phone}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="area"
              name="area"
              onChange={inputEvent}
              value={name.area}
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <input
              type="text"
              placeholder="status"
              name="status"
              onChange={inputEvent}
              value={name.status}
            />
          </div>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddCustomer;
