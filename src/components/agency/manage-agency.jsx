import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { getAgencysListUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Avatar, Table } from 'antd';
import Loader from '../utility/loader';

const ManageAgencyComponent = (props) => {
    const [agencyList, setAgencyList] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);

    useEffect(() => {
        getAgencyList();
    }, [])

    const columns = [
        {
            title: 'Agency Name',
            dataIndex: 'agencyName',
            key: 'agencyName',
            sorter: (a, b) => a?.agencyName?.toLowerCase().localeCompare(b?.agencyName?.toLowerCase()),
            render: (text, record) => <Link to={`/manage-agency/${record?._id}`}>
                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.agencyName?.charAt(0)}
                </Avatar>
                {record?.agencyName}
            </Link>
        },
        {
            title: 'Contact Person',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
        },
        {
            title: 'Email ID',
            dataIndex: 'emailId',
            key: 'emailId',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
        },
    ]

    const getAgencyList = () => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getAgencysListUrl,
        }
        axios(config).then((response) => {
            setAgencyList(response?.data?.data?.data);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    if (loaderFlag) {
        return <Loader />
    }

    return (
        <div className="manage-org-container w-100 h-100 py-4 px-5">
            <SecondaryHeader title="Manage Agency" />
            <Table
                className='w-100'
                bordered
                columns={columns}
                dataSource={agencyList}
            />
        </div>
    )
}

export default ManageAgencyComponent;