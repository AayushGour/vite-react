import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Avatar, Table } from 'antd';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployeeByIdUrl } from '../utility/api-urls';
import Loader from '../utility/loader';

const EmployeeDetailsComponent = (props) => {
    const params = useParams();


    const [employeeData, setEmployeeData] = useState({});
    const [loaderFlag, setLoaderFlag] = useState(true);

    useEffect(() => {
        getEmployeeDetails(params?.id);
    }, [])
    const referenceColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
            render: (text, record) => <>
                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.name?.charAt(0).toUpperCase()}
                </Avatar>
                {record?.name}
            </>
        },
        {
            title: 'Occupation',
            dataIndex: 'occupation',
            key: 'occupation',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },

    ]

    const getEmployeeDetails = (employeeId) => {
        const config = {
            method: "get",
            url: getEmployeeByIdUrl,
            params: {
                employeeId
            }
        }
        axios(config).then((resp) => {
            setEmployeeData(resp?.data?.data);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    return (
        loaderFlag ? <Loader /> :
            <div className="employee-details-container pb-3">
                {/* <h4 className='w-100 text-start mb-3'>Client Details</h4> */}
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Employee Name</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.name}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Father's / Husband's Name</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.guardian}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Contact Number</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.contactNumber}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Date of Birth</span>
                    <span className='text-start col-8 fs-1rem'>{new Date(employeeData?.dob).toLocaleDateString()}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Designation</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.designation}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Qualification</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.qualification}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Experience</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.experience}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Permanent Address</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.permanentAddress}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Present Address</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.presentAddress}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Lnguages known</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.languages}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Aadhar Number</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.aadharNumber}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Identification Marks</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.idMarks}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Marital Status</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.maritalStatus}</span>
                </div>
                <h5 className='w-100 text-start mt-4'>Nominee Details</h5>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Nominee Name</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.nomineeName}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3 fs-1rem'>Relationship with Nominee</span>
                    <span className='text-start col-8 fs-1rem'>{employeeData?.nomineeRelation}</span>
                </div>
                <h5 className='w-100 text-start mt-4'>References</h5>
                <div className="item-row row">
                    <Table
                        bordered
                        className='w-100'
                        dataSource={employeeData?.references}
                        columns={referenceColumns}
                        pagination={false}
                    />
                    {/* <span className='text-start fw-bold fs-1rem col-3'>References</span>
                <span className='text-start col-8 fs-1rem'>{JSON.stringify(employeeData?.references)}</span> */}
                </div>
            </div>
    )
}

export default EmployeeDetailsComponent;