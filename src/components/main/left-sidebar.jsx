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
        role === rolesList.ADMIN || role === rolesList.SUPERADMIN ? {
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
                    label: <Link to="/manage-clients/create-client">Create Client</Link>,
                    icon: null
                }
            ]
        } : {},
        role === rolesList.ADMIN || role === rolesList.SUPERADMIN ? {
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
                    label: <Link to="/manage-employees/create-user">Create Employees</Link>,
                    icon: null
                }
            ]
        } : {},
        role === rolesList.ADMIN || role === rolesList.SUPERADMIN || role === rolesList.CLIENT ? {
            key: "attendance",
            label: <Link to="/attendance">Attendance</Link>,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        } : {},
    ]

    return (
        <div className="left-sidebar h-100">
            <Menu
                items={menuItems}
                mode='inline'
                selectedKeys={
                    pathname === "/" ? ['dashboard'] :
                        pathname.includes("/create-client") ? ['createClient'] :
                            pathname.includes("/manage-clients") ? ['manageClients'] :
                                pathname.includes("/create-user") ? ['createEmployee'] :
                                    pathname.includes("/manage-employees") ? ['manageEmployees'] :
                                        pathname === "/attendance" ? ['attendance'] :
                                            []
                }
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