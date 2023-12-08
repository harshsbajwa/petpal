import { Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import { useContext, useEffect, useState } from "react";

import { IsShelterContext } from "./IsShelterContext";
import { TokenContext } from "./TokenContext";

const useAuth = () => {
    const { token, setToken } = useContext(TokenContext);
    const {isShelter, setIsShelter} = useContext(IsShelterContext);

    console.log("is shelter is" + isShelter);
    console.log("token is" + token);
    console.log(token != null && !isShelter);
    
    return token != null && !isShelter
};

const ProtectedSeekerRoutes = () => {
  return useAuth()? <Outlet /> : <Navigate to={"/"} /> ;
};
  
export default ProtectedSeekerRoutes;