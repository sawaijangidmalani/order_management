// //auth.js
// import axios from "axios";
// import {  createContext, useContext, useEffect, useState } from "react";

// const Authcontext = createContext();

// const AuthProvider = ({children}) => {
//       const [auth, setAuth] = useState({
//             user:null,
//             token:"",
//       });

//       //axios config
//       axios.defaults.baseURL = process.env.REACT_APP_API;
//       axios.defaults.headers.common["Authorization"] = auth?.token;
//       useEffect(() => {
//             const data = localStorage.getItem("auth");
//             if(data) {
//                   const parsed = JSON.parse(data);
//                   setAuth({...auth, user:parsed.user, token: parsed.token})
//             }
//       },[])
//       return (
//             <Authcontext.Provider value={[auth, setAuth]}>
//                   {children}                                           
//             </Authcontext.Provider>
//       )
// };

// const useAuth = () => useContext(Authcontext)
// export {useAuth, AuthProvider};