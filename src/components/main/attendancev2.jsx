import { Button, DatePicker, Input, Select, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAttendanceDataUrl, getEmployeesListUrl, markAttendanceUrl } from '../utility/api-urls';
import { getComputedSalaryData, rolesList } from '../utility/constants';
import Loader from '../utility/loader';
import "./attendancev2.scss";

const AttendanceComponentV2 = (props) => {
    const [selectedMonth, setSelectedMonth] = useState();
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const params = useParams();

    console.log(props)

    // useEffect(() => {
    //     getAllEmployees();
    // }, [])


    // const getAllEmployees = () => {
    //     const params = {};
    //     const role = localStorage.getItem('roles');
    //     params.allData = true;
    //     const config = {
    //         method: "get",
    //         url: getEmployeesListUrl,
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         },
    //         params: params
    //     }
    //     axios(config).then((resp) => {
    //         console.log(resp)
    //         setUsersList(resp?.data?.data?.employeeList);
    //     }).catch((e) => {
    //         console.error(e);
    //         toast.error(e?.response?.message);
    //     })
    // }

    const handleTableDataChange = (key, value, record) => {
        const { id } = record;
        if (key === "designation") {
            console.log(key, value, id, usersList)
            const newUserList = usersList?.map((emp) => emp?.id === id ? ({ ...emp, designation: value }) : emp);
            const newData = processTableData(selectedMonth, newUserList);
            handleEmployeeNumberSelect(id, record, newData)
            setTableData(newData);
        } else {
            const updatedData = tableData?.map((el) => {
                if (el?.id === id) {
                    let totalPayDays = el?.totalPayDays;
                    let shifts = el?.shifts;
                    switch (key) {
                        case "presentDays":
                            totalPayDays = Number(value) + Number(el?.holidays);
                            shifts = Number(value) + (2 * Number(el?.holidays));
                            break;
                        case "holidays":
                            totalPayDays = Number(el?.presentDays) + Number(value);
                            shifts = Number(el?.presentDays) + (2 * Number(value));
                            break;
                        default:
                            break;
                    }
                    return ({ ...el, [key]: value, totalPayDays, shifts })
                } else { return el }
            });

            // console.log(updatedData, tableData);
            setTableData(updatedData);
        }
    }

    const handleEmployeeNumberSelect = (value, record, users = usersList) => {
        setLoaderFlag(true);
        setTimeout(() => {
            const userRec = users?.find((e) => e?.id === value);
            const updatedData = tableData?.map((emp) => {
                if (emp?.id === record?.id) {
                    return {
                        ...emp,
                        ...userRec
                    }
                } else {
                    return emp
                }
            })

            setTableData(updatedData);
            setLoaderFlag(false)
        }, 300);
    }

    const tableColumns = [
        {
            title: "Employee No.",
            dataIndex: "employeeNo",
            key: "employeeNo",
            width: "70",
            render: (text, record) => <Select value={text || ""} className='w-100' onChange={(value) => handleEmployeeNumberSelect(value, record)} options={usersList?.filter((e) => !tableData?.find((x) => x?.id === e?.id))?.map((elem) => ({ label: elem?.employeeNo, value: elem?.id }))} />,
        },
        {
            title: "Employee Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Designation",
            dataIndex: "designation",
            key: "designation",
            width: "250",
            // render: (text, record) => <Input defaultValue={text} onChange={(e) => handleTableDataChange("designation", e?.target?.value, record)} />
            render: (text, record) => <Select value={text} placeholder="Select a designation" onChange={(e) => handleTableDataChange("designation", e, record)} >
                <Option value="LADY GUARD">LADY GUARD</Option>
                <Option value="HEAD GUARD">HEAD GUARD</Option>
                <Option value="SECURITY SUPERVISOR">SECURITY SUPERVISOR</Option>
                <Option value="SECURITY GUARD">SECURITY GUARD</Option>
            </Select >
        },
        {
            title: "No. of days in month",
            dataIndex: "noOfDays",
            key: "noOfDays",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("noOfDays", Number(e?.target?.value), record)} />
        },
        {
            title: "Scale",
            dataIndex: "scale",
            key: "scale",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("scale", Number(e?.target?.value), record)} />
        },
        {
            title: "Present Days",
            dataIndex: "presentDays",
            key: "presentDays",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("presentDays", Number(e?.target?.value), record)} />
        },
        {
            title: "Holidays",
            dataIndex: "holidays",
            key: "holidays",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("holidays", Number(e?.target?.value), record)} />
        },
        {
            title: "Total Pay Days",
            dataIndex: "totalPayDays",
            key: "totalPayDays"
        },
        {
            title: "Shifts",
            dataIndex: "shifts",
            key: "shifts"
        },
        {
            title: "Deductions",
            dataIndex: "",
            key: "",
            children: [
                {
                    title: "PF",
                    dataIndex: "pf",
                    key: "pf"
                },
                {
                    title: "ESI",
                    dataIndex: "esi",
                    key: "esi"
                },

            ]
        },
    ]

    const getAttendanceData = (selectedDate = selectedMonth) => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getAttendanceDataUrl,
            params: {
                startDate: selectedDate?.startOf('month')?.toDate()?.toISOString(),
                endDate: selectedDate?.endOf('month')?.toDate()?.toISOString(),
                clientId: params?.id,
            }
        };
        axios(config).then((resp) => {
            processTableData(selectedDate, resp?.data?.data);
        }).catch((error) => {
            console.error(error)
            toast.error(error?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    const generateAttendanceTable = (value) => {
        setSelectedMonth(value);
        setTableData([]);
        setLoaderFlag(true);
        getAttendanceData(value);
    }

    const processTableData = (selectedDate, data) => {
        const daysInMonth = selectedDate?.daysInMonth() === 31 ? selectedDate?.daysInMonth() - (4) : selectedDate?.daysInMonth() - (4) + (2);
        const processedData = Array.isArray(data) && data?.length > 0 ? data?.map((emp, ind) => {
            const estimateDat = props?.clientData?.estimateData?.find((est) => est?.designation === emp?.designation);
            const computedData = !!estimateDat ? estimateDat : getComputedSalaryData(emp?.salary);
            // const scale = emp?.salary?.additionalAllowance + emp?.salary?.bonus + emp?.salary?.earnedLeave + emp?.salary?.salary + emp?.salary?.uniformCharges + emp?.salary?.washingAllowance;
            const scale = Number(computedData?.subTotalB) - (Number(computedData?.pf) + Number(computedData?.esi))
            // console.log("computeddData", computedData)
            return ({
                id: emp?.id || emp?._id,
                assignmentId: emp?.id || emp?._id,
                agencyId: emp?.agencyId,
                clientId: emp?.clientId,
                employeeId: emp?.employeeId || emp?._id,
                employeeNo: emp?.employeeNo,
                name: emp?.name,
                designation: emp?.designation,
                noOfDays: daysInMonth || emp?.attendance?.noOfDays,
                scale: scale || emp?.attendance?.scale,
                presentDays: emp?.attendance?.presentDays || 0,
                holidays: emp?.attendance?.holidays || 0,
                totalPayDays: emp?.attendance?.totalPayDays || 0,
                shifts: emp?.attendance?.shifts || 0,
                date: selectedDate?.toISOString(),
                pf: Number(computedData?.pf),
                esi: Number(computedData?.esi),
            })
        }) : [];
        setUsersList(processedData);
        return processedData;
    }

    const handleAttendanceDataSubmit = () => {
        const config = {
            method: "post",
            url: markAttendanceUrl,
            data: {
                attendanceData: tableData,
            }
        }
        axios(config).then((resp) => {
            console.log(resp?.data);
            toast.success("Attendance saved successfully");
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        })
    }

    const addRowForAttendance = () => {
        const daysInMonth = dayjs(selectedMonth).daysInMonth();
        const id = new Date().getTime();
        setTableData((prev) => ([...prev, {
            id: id,
            // assignmentId: id,
            // agencyId: localStorage.getItem("agencyId"),
            // clientId: params?.id,
            // employeeId: "",
            // employeeNo: "",
            // name: "",
            // designation: "",
            // noOfDays: daysInMonth,
            // scale: 0,
            // presentDays: 0,
            // holidays: 0,
            // totalPayDays: 0,
            // shifts: 0,
            // date: selectedMonth?.toISOString(),
        }]));

    }

    return (
        <div className={`attendance-container h-100 w-100 pb-4`}>
            <div className="d-flex flex-row justify-content-start mb-3">
                <DatePicker picker="month" onChange={generateAttendanceTable} value={selectedMonth} />
            </div>
            {loaderFlag ?
                <Loader />
                :
                <div className="w-100">
                    <div className="d-flex flex-row justify-content-end w-100">
                        <Button disabled={!selectedMonth} className='ms-3 mb-2 align-self-end' type='primary' onClick={addRowForAttendance}>Add Row</Button>
                    </div>

                    <Table
                        dataSource={tableData}
                        columns={tableColumns}
                        pagination={false}
                    />
                    <div className="w-100 mt-4 text-start">
                        <Button disabled={!selectedMonth} type='primary' onClick={() => handleAttendanceDataSubmit()}>Save</Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default AttendanceComponentV2;