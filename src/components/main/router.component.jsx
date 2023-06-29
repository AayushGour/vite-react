import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginComponent from './login';
import AuthenticationComponent from './Auth';

const RouterComponent = (props) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<AuthenticationComponent />} >
                <Route path="" element="Hello" />
            </Route>
        </Routes>
    )
}

export default RouterComponent;