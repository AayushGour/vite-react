import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CreateClientComponent from '../clients/create-client';
import ManageClientsComponent from '../clients/manage-clients';
import ViewClientComponent from '../clients/view-client';
import ManageUserComponent from '../employees/manage-employees';
import AuthenticationComponent from './Auth';
import LoginComponent from './login';
import CreateUserComponent from '../employees/create-employee';
import DashboardComponent from './dashboard';
import SignupComponent from './signup';

const RouterComponent = (props) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route element={<AuthenticationComponent />} >
                <Route path="" element={<DashboardComponent />} />
                <Route path="manage-employees" >
                    <Route path="" element={<ManageUserComponent />} />
                    <Route path="create-user" element={<CreateUserComponent />} />
                </Route>
                <Route path="manage-clients" >
                    <Route path="" element={<ManageClientsComponent />} />
                    <Route path=":id" element={<ViewClientComponent />} />
                    <Route path="create-client" element={<CreateClientComponent />} />
                </Route>

                <Route path="attendance" element={"Coming Soon"} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default RouterComponent;