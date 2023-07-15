import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getClientsListUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import SecondaryHeader from '../utility/secondary-header';
import { Table } from 'antd';

const ManageClientsComponent = (props) => {
    const navigate = useNavigate();
    const [clientsList, setClientsList] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);

    const columns = [
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            key: 'clientName',
            sorter: (a, b) => a?.clientName?.toLowerCase().localeCompare(b?.clientName?.toLowerCase()),
            render: (text, record) => <Link to={`/manage-clients/${record?._id}`}>{record?.clientName}</Link>
        },
        {
            title: 'Contact Person',
            dataIndex: 'contactPerson',
            sorter: (a, b) => a?.contactPerson?.toLowerCase().localeCompare(b?.contactPerson?.toLowerCase()),
            key: 'contactPerson',
        },
        {
            title: 'Contact Email',
            dataIndex: 'contactEmail',
            key: 'contactEmail',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            sorter: (a, b) => a?.country?.toLowerCase().localeCompare(b?.country?.toLowerCase()),
            key: 'country',
        },
        {
            title: 'Creation Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: (a, b) => new Date(a?.createdDate) - new Date(b?.createdDate),
            render: (text) => new Date(text).toLocaleDateString()
        },
    ];
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
            <Table
                className='w-100'
                bordered
                columns={columns}
                dataSource={clientsList}
            />
        </div>

    )
}

export default ManageClientsComponent;