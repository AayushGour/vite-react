import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getClientsListUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import SecondaryHeader from '../utility/secondary-header';
import { Avatar, Table } from 'antd';

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
            render: (text, record) => <Link to={`/manage-clients/${record?._id}`}>
                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.clientName?.charAt(0)}
                </Avatar>
                {record?.clientName}
            </Link>
        },
        {
            title: 'Contact Person',
            dataIndex: 'contactPerson',
            sorter: (a, b) => a?.contactPerson?.toLowerCase().localeCompare(b?.contactPerson?.toLowerCase()),
            key: 'contactPerson',
            render: (text, record) => <span>
                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.contactPerson?.charAt(0)}
                </Avatar>
                {record?.contactPerson}
            </span>
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
        {
            title: '',
            dataIndex: '_id',
            key: '_id',
            render: (text, record) => {
                return <div className="d-flex align-items-center">
                    <span style={{ marginRight: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </span>
                    <Link to={`/manage-clients/edit/${record?._id}`} style={{ marginRight: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2245b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                    </Link>
                    <Link to={`/manage-clients/delete/${record?._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height=" 20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </Link>
                </div>
            }
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
        <div className="manage-clients-container h-100 w-100 py-4 px-5">
            <SecondaryHeader
                title="Manage Clients"
            // extraDetails={
            //     <Button onClick={() => navigate("/manage-clients/create-client")}>Create Client</Button>
            // }
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