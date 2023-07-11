import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginComponent from './login';
import AuthenticationComponent from './Auth';
import LayoutComponent from './layout';

const RouterComponent = (props) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<AuthenticationComponent />} >
                <Route path="" element={<LayoutComponent />} />
            </Route>
        </Routes>
    )
}

export default RouterComponent;