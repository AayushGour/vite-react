import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthenticationComponent = (props) => {
    const isLoggedIn = localStorage.getItem("token");
    const { pathname } = useLocation();
    return (
        isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />
    )
}

export default AuthenticationComponent;