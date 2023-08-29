import { Button, DatePicker, Input, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEmployeesSalaryDetailsUrl, updateEmployeesSalaryDetailsUrl } from '../utility/api-urls';
import Loader from '../utility/loader';
import SecondaryHeader from '../utility/secondary-header';

const EmployeeSalaryTableComponent = (props) => {
    const [editedSalaryDetails, setEditedSalaryDetails] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);


    const getSalaryDetails = () => {
        setLoaderFlag(true);
        setLoaderFlag(false);
        const config = {
            method: "get",
            url: getEmployeesSalaryDetailsUrl,
            params: {
                agencyId: localStorage?.getItem("agencyId"),

            }
        };
        axios(config).then((resp) => {
            console.log(resp?.data);
            setDataSource(resp?.data?.data)
            setEditedSalaryDetails(resp?.data?.data || [])
        }).catch((error) => {
            console.error(error)
            toast.error(error?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    useEffect(() => {
        getSalaryDetails();
    }, [])

    const handleSalaryDetailsChange = (value, record, key) => {
        const updatedSalaryDetails = editedSalaryDetails.map((elem) =>
            elem._id === record._id ? { ...elem, [key]: value } : elem
        );
        setEditedSalaryDetails(updatedSalaryDetails);
    };

    const generateColumns = () => {
        const columns = [
            {
                title: "Id",
                dataIndex: "employeeId",
                key: "employeeId"
            },
            {
                title: "Employee Name",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "Designation",
                dataIndex: "designation",
                key: "designation"
            },
            {
                title: "Fixed Salary",
                children: [
                    {
                        title: "Basic Salary",
                        dataIndex: "salary",
                        key: "salary",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.salary} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "salary")} />
                    },
                    {
                        title: "EL Cost",
                        dataIndex: "earnedLeave",
                        key: "earnedLeave",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.earnedLeave} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "earnedLeave")} />
                    },
                    {
                        title: "Washing Allowance",
                        dataIndex: "washingAllowance",
                        key: "washingAllowance",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.washingAllowance} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "washingAllowance")} />
                    },
                ],
            },
            {
                title: "Deductions",
                children: [
                    {
                        title: "ESI",
                        dataIndex: "esi",
                        key: "esi",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.esi} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "esi")} />
                    },
                    {
                        title: "Additional Allowance",
                        dataIndex: "additionalAllowance",
                        key: "additionalAllowance",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.additionalAllowance} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "additionalAllowance")} />
                    },
                    {
                        title: "Uniform Charges",
                        dataIndex: "uniformCharges",
                        key: "uniformCharges",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.uniformCharges} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "uniformCharges")} />
                    },
                    {
                        title: "Provident Fund",
                        dataIndex: "pf",
                        key: "pf",
                        render: (value, record) => <Input value={editedSalaryDetails?.find((elem) => elem?._id === record?._id)?.pf} defaultValue={value} onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record, "pf")} />
                    },
                ],
            },
        ];

        // daysOfWeek.forEach((day, index) => {
        //     const date = selectedDate.startOf("week").add(index, "day");
        //     const formattedDate = date.format("MMM DD");
        //     columns.push(
        //         {
        //             title: `${day} ${formattedDate}`,
        //             render: (text, record) => <Input
        //                 // value={}
        //                 className='w-100'
        //                 date={date}
        //                 record={record}
        //                 onChange={(value, record) => handleSalaryDetailsChange(value, record, date?.toDate())}
        //             />,
        //             key: `attendance-status_${formattedDate}`,
        //             dataIndex: `attendance-status_${formattedDate}`
        //         }
        //     );
        // });

        return columns;
    };

    const resetData = () => {
        setEditedSalaryDetails(dataSource);
    }


    const handleSubmitSalaryDetails = () => {
        console.log(editedSalaryDetails)
        const config = {
            method: "put",
            url: updateEmployeesSalaryDetailsUrl,
            data: {
                agencyId: localStorage.getItem('agencyId'),
                salaryDetails: editedSalaryDetails
            }
        }
        axios(config).then((resp) => {
            console.log(resp?.data);
            toast.success("Details updated successfully")
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        })
    }

    return (
        <div className="employee-salary-table-component h-100 w-100 px-5 py-4">
            <SecondaryHeader title="Employees Salary Details" />
            <div className='h-90 w-100'>
                {loaderFlag ? <Loader /> :
                    <>
                        <Table className='salary-table' bordered columns={generateColumns()} dataSource={dataSource} pagination={false} />
                        {dataSource?.length > 0 ?
                            <div className="w-100 mt-3 d-flex flex-row justify-content-end">
                                <Button className='' type='secondary' onClick={resetData}>Reset</Button>
                                <Button className='ms-2' type='primary' onClick={handleSubmitSalaryDetails}>Submit</Button>
                            </div>
                            : <></>}
                    </>
                }
            </div>
        </div>
    )
}

export default EmployeeSalaryTableComponent;