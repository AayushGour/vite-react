import React, { useEffect, useState } from 'react';
import { getEmployeesListUrl, getUsersListUrl } from '../utility/api-urls';
import axios from 'axios';
import Loader from '../utility/loader';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import SecondaryHeader from '../utility/secondary-header';
import { rolesList } from '../utility/constants';
import { Avatar, Table } from 'antd';

const ManageUserComponent = (props) => {
    const navigate = useNavigate();

    const [loaderFlag, setLoaderFlag] = useState(true);
    const [usersList, setUsersList] = useState([]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
            // render: (text, record) => <Link to={`/manage-clients/${record?._id}`}>{record?.clientName}</Link>
            render: (text, record) => <Link to={`/manage-employees/${record?._id}`}>
                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.name?.charAt(0)}
                </Avatar>
                {record?.name}
            </Link>
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            sorter: (a, b) => a?.designation?.toLowerCase().localeCompare(b?.designation?.toLowerCase()),
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            key: 'clientName',
            sorter: (a, b) => a?.clientName?.toLowerCase().localeCompare(b?.clientName?.toLowerCase()),
            render: (text, record) => <Link to={`/manage-clients/${record?.clientId}`}>
                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.clientName?.charAt(0)}
                </Avatar>
                {record?.clientName}
            </Link>
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            sorter: (a, b) => new Date(a?.dob) - new Date(b?.dob),
            key: 'dob',
        },
        {
            title: 'Creation Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: (a, b) => new Date(a?.createdDate) - new Date(b?.createdDate),
            render: (text) => new Date(text).toLocaleDateString()
        },
        {
            title: '',
            dataIndex: '_id',
            key: '_id',
            render: (text, record) => {
                return <div className="d-flex align-items-center">
                    <span style={{ marginRight: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </span>
                    <Link to={`/manage-employees/edit/${record?._id}`} style={{ marginRight: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2245b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                    </Link>
                    <Link to={`/manage-employees/delete/${record?._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height=" 20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </Link>
                </div>
            }
        },
    ];

    const role = localStorage.getItem('roles');
    useEffect(() => {
        getUsersList();
    }, [])

    const getUsersList = () => {
        const params = {};
        if (role === rolesList.ADMIN || role === rolesList.SUPERADMIN) {
            params.allData = true;
        } else {
            params.clientId = localStorage.getItem('clientId');
        }
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getEmployeesListUrl,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: params
        }
        axios(config).then((resp) => {
            setUsersList(resp?.data?.data?.employeeList?.map((dat) => ({ clientName: dat?.clientName, ...dat?.employeeData })))
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }
    if (loaderFlag) {
        return <Loader />
    }
    return (
        <div className="manage-employees-container h-100 w-100 py-4 px-5">
            <SecondaryHeader
                title="Manage Employees"
            // extraDetails={
            //     <Button onClick={() => navigate("/manage-employees/create-user")}>Add Employee</Button>
            // }
            />
            <Table
                className='w-100'
                bordered
                columns={columns}
                dataSource={usersList}
            />
            {/* <Table className='users-table mt-3' striped bordered>
                <thead>
                    <tr>
                        <th className='text-start ps-3'>Name</th>
                        <th className='text-start ps-3'>Designation</th>
                        <th className='text-start ps-3'>ClientName</th>
                        <th className='text-start ps-3'>Date of Birth</th>
                        <th className='text-start ps-3'>Created On</th>
                    </tr>
                </thead>
                <tbody>
                    {usersList?.map((user, index) => {
                        return <tr key={index}>
                            <td className='text-start ps-3'>{user?.employeeData?.name}</td>
                            <td className='text-start ps-3'>{user?.employeeData?.designation}</td>
                            <td className='text-start ps-3'>{user?.clientName}</td>
                            <td className='text-start ps-3'>{new Date(user?.employeeData?.dob).toLocaleDateString()}</td>
                            <td className='text-start ps-3'>{new Date(user?.employeeData?.createdDate).toLocaleDateString()}</td>
                        </tr>
                    })}
                </tbody>
            </Table> */}
        </div>
    )
}

export default ManageUserComponent;