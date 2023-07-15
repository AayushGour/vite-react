import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LayoutComponent from './layout';

const AuthenticationComponent = (props) => {
    const isLoggedIn = localStorage.getItem("token");
    const { pathname } = useLocation();
    return (
        !!isLoggedIn && isLoggedIn !== "undefined" ? <LayoutComponent /> : <Navigate to={"/login"} />
    )
}

export default AuthenticationComponent;