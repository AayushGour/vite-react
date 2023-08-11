import { Button, DatePicker, Input, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEmployeesSalaryDetailsUrl } from '../utility/api-urls';
import Loader from '../utility/loader';
import SecondaryHeader from '../utility/secondary-header';

const EmployeeSalaryTableComponent = (props) => {
    const [editedSalaryDetails, setEditedSalaryDetails] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().startOf("week"));


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
            // setDataSource(resp?.data?.data)
            // setEditedSalaryDetails(resp?.data?.data?.attendance || [])
        }).catch((error) => {
            console.error(error)
            toast.error(error?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    useEffect(() => {
        handleMonthChange(dayjs());
    }, [])

    const handleSalaryDetailsChange = (value, record, date) => {
        // Handle time change and update the data accordingly
        console.log("Time changed:", value, record, date);
        const attendanceDat = [...editedSalaryDetails] || [];
        const attendanceIndex = attendanceDat?.findIndex((att) => att?._id === record?._id && att?.date === date);
        if (attendanceIndex !== -1) {
            attendanceDat[attendanceIndex].status = value;
        } else {
            attendanceDat.push({ ...record, status: value, date });
        }
        setEditedSalaryDetails(attendanceDat);
    };


    const handleMonthChange = (dates) => {
        // Handle week change and update the selectedMonth state
        const startOfWeek = dayjs(dates).startOf("week");
        const endOfWeek = dayjs(dates).endOf("week");

        const pickerInput = document.querySelector('.attendance-date-picker .ant-picker-input');
        pickerInput?.setAttribute("start-date", startOfWeek?.format("DD-MM-YYYY"));
        pickerInput?.setAttribute("end-date", endOfWeek?.format("DD-MM-YYYY"));

        setSelectedMonth(startOfWeek);
        generateColumns(startOfWeek);
        getSalaryDetails(startOfWeek);
    };
    const generateColumns = (selectedDate = selectedMonth) => {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const columns = [
            {
                title: "Id",
                dataIndex: "employeeId",
                key: "employeeId"
            },
            {
                title: "Employee Name",
                dataIndex: "employeeName",
                key: "employeeName"
            },
            {
                title: "Designation",
                dataIndex: "designation",
                key: "designation"
            },
            {
                title: "Basic Salary",
                dataIndex: "basicSalary",
                key: "basicSalary",
                render: (value, record) => <Input onChange={(e) => handleSalaryDetailsChange(e?.target?.value, record)} />
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


    const handleSubmitSalaryDetails = () => {
        const config = {
            method: "post",
            url: markAttendanceUrl,
            data: {
                attendanceData: editedSalaryDetails,
            }
        }
        axios(config).then((resp) => {
            console.log(resp?.data)
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        })
    }

    return (
        <div className="employee-salary-table-component h-100 w-100 px-5 py-4">
            <SecondaryHeader title="Employees Salary Details" />
            <div className='h-90 w-100'>
                <div className="w-100 d-flex flex-row justify-content-center mb-3 gap-3 align-items-center">
                    <Button title='Previous Week' onClick={() => handleMonthChange(selectedMonth?.subtract(1, 'week'))} ghost icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>} />
                    <DatePicker
                        id='attendance-date-picker'
                        className='attendance-date-picker'
                        picker="month"
                        onChange={handleMonthChange}
                        allowClear={false}
                        format="YYYY-MM-DD"
                        // disabledDate={disabledDate}
                        suffixIcon={<span className='fs-1_1rem'>to</span>}
                        defaultValue={selectedMonth}
                    />
                    <Button title="Next Week" onClick={() => handleMonthChange(selectedMonth?.add(1, "week"))} ghost icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>} />
                </div>
                {loaderFlag ? <Loader /> :
                    <>
                        <Table className='attendance-table' bordered columns={generateColumns()} dataSource={dataSource} pagination={false} />
                        {dataSource?.length > 0 ?
                            <Button type='primary' onClick={handleSubmitSalaryDetails}>Submit</Button>
                            : <></>}
                    </>
                }
            </div>
        </div>
    )
}

export default EmployeeSalaryTableComponent;