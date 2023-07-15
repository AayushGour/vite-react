import React, { useEffect, useState } from 'react';
import { getEmployeesListUrl, getUsersListUrl } from '../utility/api-urls';
import axios from 'axios';
import Loader from '../utility/loader';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SecondaryHeader from '../utility/secondary-header';
import { rolesList } from '../utility/constants';
import { Table } from 'antd';

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
                extraDetails={
                    <Button onClick={() => navigate("/manage-employees/create-user")}>Add Employee</Button>
                }
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