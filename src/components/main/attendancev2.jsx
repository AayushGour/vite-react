import { Button, DatePicker, Input, Table } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAttendanceDataUrl, markAttendanceUrl } from '../utility/api-urls';
import { getComputedSalaryData } from '../utility/constants';
import Loader from '../utility/loader';
import "./attendancev2.scss";

const AttendanceComponentV2 = (props) => {
    const [selectedMonth, setSelectedMonth] = useState();
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [tableData, setTableData] = useState([]);
    const params = useParams();

    const handleTableDataChange = (key, value, id) => {
        console.log(key, value, id);
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
        console.log(updatedData, tableData);
        setTableData(updatedData);
    }

    const tableColumns = [
        {
            title: "Employee No.",
            dataIndex: "employeeNo",
            key: "employeeNo"
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
            title: "No. of days in month",
            dataIndex: "noOfDays",
            key: "noOfDays",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("noOfDays", Number(e?.target?.value), record?.id)} />
        },
        {
            title: "Scale",
            dataIndex: "scale",
            key: "scale",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("scale", Number(e?.target?.value), record?.id)} />
        },
        {
            title: "Present Days",
            dataIndex: "presentDays",
            key: "presentDays",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("presentDays", Number(e?.target?.value), record?.id)} />
        },
        {
            title: "Holidays",
            dataIndex: "holidays",
            key: "holidays",
            render: (text, record) => <Input defaultValue={Number(text)} type="number" onChange={(e) => handleTableDataChange("holidays", Number(e?.target?.value), record?.id)} />
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
            const computedData = getComputedSalaryData(emp?.salary);
            // const scale = emp?.salary?.additionalAllowance + emp?.salary?.bonus + emp?.salary?.earnedLeave + emp?.salary?.salary + emp?.salary?.uniformCharges + emp?.salary?.washingAllowance;
            const scale = Number(computedData?.subTotalB) - (Number(computedData?.pf) + Number(computedData?.esi))
            // console.log("computeddData", computedData)
            return ({
                id: emp?._id,
                agencyId: emp?.agencyId,
                clientId: emp?.clientId,
                employeeId: emp?.employeeId,
                employeeNo: emp?.employeeNo,
                employeeName: emp?.employeeName,
                designation: emp?.designation,
                noOfDays: emp?.attendance?.noOfDays || daysInMonth,
                scale: emp?.attendance?.scale || scale,
                presentDays: emp?.attendance?.presentDays || 0,
                holidays: emp?.attendance?.holidays || 0,
                totalPayDays: emp?.attendance?.totalPayDays || 0,
                shifts: emp?.attendance?.shifts || 0,
                date: selectedDate?.toISOString(),
            })
        }) : [];
        setTableData(processedData)
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

    return (
        <div className={`attendance-container h-100 w-100 pb-4`}>
            <div className="d-flex flex-row justify-content-start mb-3">
                <DatePicker picker="month" onChange={generateAttendanceTable} value={selectedMonth} />
            </div>
            {loaderFlag ?
                <Loader />
                :
                <div className="w-100">
                    <Table
                        dataSource={tableData}
                        columns={tableColumns}
                        pagination={false}
                    />
                    <div className="w-100 mt-4 text-start">
                        <Button type='primary' onClick={() => handleAttendanceDataSubmit()}>Save</Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default AttendanceComponentV2;