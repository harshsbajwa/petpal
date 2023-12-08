import { Navigate, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import { useContext, useEffect, useState } from "react";

import { IsShelterContext } from "./IsShelterContext";
import { TokenContext } from "./TokenContext";

const useAuth = () => {
    const { token, setToken } = useContext(TokenContext);
    const {isShelter, setIsShelter} = useContext(IsShelterContext);
    
    return token != null && isShelter
};

const ProtectedSeekerRoutes = () => {
  return useAuth()? <Outlet /> : <Navigate to={"/"} /> ;
};
  
export default ProtectedSeekerRoutes;