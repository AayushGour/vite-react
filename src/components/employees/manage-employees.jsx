import React, { useEffect, useState } from 'react';
import { getEmployeesListUrl, getUsersListUrl } from '../utility/api-urls';
import axios from 'axios';
import Loader from '../utility/loader';
import { Button, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SecondaryHeader from '../utility/secondary-header';
import { rolesList } from '../utility/constants';

const ManageUserComponent = (props) => {
    const navigate = useNavigate();

    const [loaderFlag, setLoaderFlag] = useState(true);
    const [usersList, setUsersList] = useState([]);
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
            setUsersList(resp?.data?.data?.employeeList)
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
        <div className="manage-employees-container h-100 w-100 p-4">
            <SecondaryHeader
                title="Manage Employees"
                extraDetails={
                    <Button onClick={() => navigate("/manage-employees/create-user")}>Add Employee</Button>
                }
            />

            <Table className='users-table mt-3' striped bordered>
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
            </Table>
        </div>
    )
}

export default ManageUserComponent;