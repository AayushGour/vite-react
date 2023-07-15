import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getClientsListUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import SecondaryHeader from '../utility/secondary-header';

const ManageClientsComponent = (props) => {
    const navigate = useNavigate();
    const [clientsList, setClientsList] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);
    useEffect(() => {
        getClientsList();
    }, [])

    const getClientsList = () => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getClientsListUrl,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }
        axios(config).then((resp) => {
            setClientsList(resp?.data?.data?.data)
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
        <div className="manage-clients-container h-100 w-100 p-4">
            <SecondaryHeader
                title="Manage Clients"
                extraDetails={
                    <Button onClick={() => navigate("/manage-clients/create-client")}>Create Client</Button>
                }
            />
            <Table className='clients-table mt-3' striped bordered>
                <thead>
                    <tr>
                        <th className='text-start ps-3'>Client Name</th>
                        <th className='text-start ps-3'>Contact Person</th>
                        <th className='text-start ps-3'>Email ID</th>
                        <th className='text-start ps-3'>Country</th>
                        <th className='text-start ps-3'>Creation Date</th>
                    </tr>
                </thead>
                <tbody>
                    {clientsList?.map((user, index) => {
                        return <tr key={index}>
                            <td className='text-start ps-3'><Link to={`/manage-clients/${user?._id}`}>{user?.clientName}</Link></td>
                            <td className='text-start ps-3'>{user?.contactPerson}</td>
                            <td className='text-start ps-3'>{user?.contactEmail}</td>
                            <td className='text-start ps-3'>{user?.country}</td>
                            <td className='text-start ps-3'>{new Date(user?.createdDate).toLocaleDateString()}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>

    )
}

export default ManageClientsComponent;