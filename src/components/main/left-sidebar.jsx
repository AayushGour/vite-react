import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import "./left-sidebar.scss";
import { rolesList } from '../utility/constants';
import { Menu } from 'antd';

const LeftSidebar = (props) => {
    const { pathname } = useLocation();
    const role = localStorage.getItem('roles');

    const menuItems = [
        {
            key: "dashboard",
            label: <Link to="/">Dashboard</Link>,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" /><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" /></svg>
        },
        role === rolesList.SUPERADMIN ? {
            key: "agencyMaster",
            label: "Agency Master",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
            children: [
                {
                    key: "manageAgency",
                    label: <Link to="/manage-agency">Manage Agency</Link>,
                    icon: null
                },
                {
                    key: "createAgency",
                    label: <Link to="/manage-agency/create-agency">Onboard Agency</Link>,
                    icon: null
                }
            ]
        } : {},
        role === rolesList.ADMIN ? {
            key: "clientMaster",
            label: "Client Master",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
            children: [
                {
                    key: "manageClients",
                    label: <Link to="/manage-clients">Manage Clients</Link>,
                    icon: null
                },
                {
                    key: "createClient",
                    label: <Link to="/manage-clients/create-client">Onboard Client</Link>,
                    icon: null
                }
            ]
        } : {},
        role === rolesList.ADMIN ? {
            key: "employeeMaster",
            label: "Employee Master",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
            children: [
                {
                    key: "manageEmployees",
                    label: <Link to="/manage-employees">Manage Employees</Link>,
                    icon: null
                },
                {
                    key: "createEmployee",
                    label: <Link to="/manage-employees/create-user">Onboard Employees</Link>,
                    icon: null
                }
            ]
        } : {},
        role === rolesList.CLIENT ? {
            key: "attendance",
            label: <Link to="/attendance">Attendance</Link>,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        } : {},
        // role === rolesList.CLIENT || role === rolesList.ADMIN ? {
        //     key: "salaryDetails",
        //     label: <Link to="/payroll">Salary Details</Link>,
        //     icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" height="20" width="20"><path d="M.0022 64C.0022 46.33 14.33 32 32 32H288C305.7 32 320 46.33 320 64C320 81.67 305.7 96 288 96H231.8C241.4 110.4 248.5 126.6 252.4 144H288C305.7 144 320 158.3 320 176C320 193.7 305.7 208 288 208H252.4C239.2 266.3 190.5 311.2 130.3 318.9L274.6 421.1C288.1 432.2 292.3 452.2 282 466.6C271.8 480.1 251.8 484.3 237.4 474L13.4 314C2.083 305.1-2.716 291.5 1.529 278.2C5.774 264.1 18.09 256 32 256H112C144.8 256 173 236.3 185.3 208H32C14.33 208 .0022 193.7 .0022 176C.0022 158.3 14.33 144 32 144H185.3C173 115.7 144.8 96 112 96H32C14.33 96 .0022 81.67 .0022 64V64z" id="mainIconPathAttribute"></path></svg>
        // } : {},
        role === rolesList.ADMIN ? {
            key: "estimate",
            label: <Link to="/estimate">Estimate</Link>,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" /><path d="M15 7h6v6" /></svg>
        } : {},
    ]

    return (
        <div className="left-sidebar h-100">
            <Menu
                items={menuItems?.filter((e) => Object.keys(e)?.length > 0)}
                mode='inline'
                selectedKeys={
                    pathname === "/" ? ['dashboard'] :
                        pathname.includes("/create-agency") ? ['createAgency'] :
                            pathname.includes("/manage-agency") ? ['manageAgency'] :
                                pathname.includes("/create-client") ? ['createClient'] :
                                    pathname.includes("/manage-clients") ? ['manageClients'] :
                                        pathname.includes("/create-user") ? ['createEmployee'] :
                                            pathname.includes("/manage-employees") ? ['manageEmployees'] :
                                                pathname === "/attendance" ? ['attendance'] :
                                                    pathname === "/payroll" ? ['salaryDetails'] :
                                                        pathname === "/estimate" ? ['estimate'] :
                                                            []
                }
                openKeys={["agencyMaster", "clientMaster", "employeeMaster"]}
            />
            {/* <ListGroup className='sidebar-list border-0'>
                <ListGroup.Item action active={location.pathname === "/"} href='/'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" /><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" /></svg>
                    Dashboard
                </ListGroup.Item>
                {
                    role === rolesList.ADMIN || role === rolesList.SUPERADMIN ?
                        <ListGroup.Item action active={location.pathname.includes("/manage-clients")} href="/manage-clients">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Manage Clients
                        </ListGroup.Item>
                        : <></>
                }
                {role === rolesList.ADMIN || role === rolesList.SUPERADMIN || role === rolesList.CLIENT ?
                    <>
                        <ListGroup.Item action active={location.pathname.includes("/manage-employees")} href="/manage-employees">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Manage Employees
                        </ListGroup.Item>
                        <ListGroup.Item action active={location.pathname === "/attendance"} href="/attendance">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Attendance
                        </ListGroup.Item>
                    </>
                    : <></>}
            </ListGroup> */}
        </div >
    )
}

export default LeftSidebar;