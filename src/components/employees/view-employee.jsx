import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SecondaryHeader from '../utility/secondary-header';
import Loader from '../utility/loader';
import { getEmployeeByIdUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./view-employee.scss";
import { Avatar, Table } from 'antd';

const ViewEmployeeComponent = (props) => {
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
        <div className="view-employee-container h-100 w-100 px-5 py-4">
            <SecondaryHeader goBack title="Employee Details" />
            {loaderFlag ? <Loader /> :
                <div className="employee-details-container pb-3">
                    {/* <h4 className='w-100 text-start mb-3'>Client Details</h4> */}
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Employee Name</span>
                        <span className='text-start col-8'>{employeeData?.name}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Father's / Husband's Name</span>
                        <span className='text-start col-8'>{employeeData?.guardian}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Contact Number</span>
                        <span className='text-start col-8'>{employeeData?.contactNumber}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Date of Birth</span>
                        <span className='text-start col-8'>{new Date(employeeData?.dob).toLocaleDateString()}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Designation</span>
                        <span className='text-start col-8'>{employeeData?.designation}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Qualification</span>
                        <span className='text-start col-8'>{employeeData?.qualification}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Experience</span>
                        <span className='text-start col-8'>{employeeData?.experience}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Permanent Address</span>
                        <span className='text-start col-8'>{employeeData?.permanentAddress}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Present Address</span>
                        <span className='text-start col-8'>{employeeData?.presentAddress}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Lnguages known</span>
                        <span className='text-start col-8'>{employeeData?.languages}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Aadhar Number</span>
                        <span className='text-start col-8'>{employeeData?.aadharNumber}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Identification Marks</span>
                        <span className='text-start col-8'>{employeeData?.idMarks}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Marital Status</span>
                        <span className='text-start col-8'>{employeeData?.maritalStatus}</span>
                    </div>
                    <h5 className='w-100 text-start mt-4'>Nominee Details</h5>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Nominee Name</span>
                        <span className='text-start col-8'>{employeeData?.nomineeName}</span>
                    </div>
                    <div className="item-row row">
                        <span className='text-start fw-bold col-3'>Relationship with Nominee</span>
                        <span className='text-start col-8'>{employeeData?.nomineeRelation}</span>
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
                        {/* <span className='text-start fw-bold col-3'>References</span>
                        <span className='text-start col-8'>{JSON.stringify(employeeData?.references)}</span> */}
                    </div>
                </div>
            }
        </div>
    )
}

export default ViewEmployeeComponent;