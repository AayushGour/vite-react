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
import AttendanceComponent from './attendance';
import ViewEmployeeComponent from '../employees/view-employee';
import CreateAgencyComponent from '../agency/create-agency';
import ManageAgencyComponent from '../agency/manage-agency';
import ViewAgencyComponent from '../agency/view-agency';

const RouterComponent = (props) => {
    return (
        <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route element={<AuthenticationComponent />} >
                <Route path="" element={<DashboardComponent />} />
                <Route path="manage-employees" >
                    <Route path="" element={<ManageUserComponent />} />
                    <Route path=":id" element={<ViewEmployeeComponent />} />
                    <Route path="create-user" element={<CreateUserComponent />} />
                </Route>
                <Route path="manage-clients" >
                    <Route path="" element={<ManageClientsComponent />} />
                    <Route path=":id" element={<ViewClientComponent />} />
                    <Route path="create-client" element={<CreateClientComponent />} />
                </Route>
                <Route path="manage-agency" >
                    <Route path="" element={<ManageAgencyComponent />} />
                    <Route path=":id" element={<ViewAgencyComponent />} />
                    <Route path="create-agency" element={<CreateAgencyComponent />} />
                </Route>

                <Route path="attendance" element={<AttendanceComponent />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default RouterComponent;