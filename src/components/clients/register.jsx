import { DatePicker, Button, Table } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClientRegisterDataUrl } from '../utility/api-urls';
import Loader from '../utility/loader';

const WageRegisterComponent = (props) => {
    const [tableData, setTableData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState();
    const [loaderFlag, setLoaderFlag] = useState(false);

    const params = useParams();

    const tableColumns = [
        {
            title: "S. No.",
            dataIndex: "",
            key: "sno",
            render: (text, record, index) => index + 1
        },
        {
            title: "Employee No.",
            dataIndex: "employeeNo",
            key: "employeeNo"
        },
        {
            title: "UAN",
            dataIndex: "uan",
            key: "uan"
        },
        {
            title: "ESI No.",
            dataIndex: "esi",
            key: "esi"
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
            title: "Days in Month",
            dataIndex: "noOfDays",
            key: "noOfDays"
        },
        {
            title: "Days Worked",
            dataIndex: "presentDays",
            key: "presentDays"
        },
        {
            title: "NFH Days",
            dataIndex: "nfh",
            key: "nfh"
        },
        {
            title: "Scale",
            dataIndex: "scale",
            key: "scale"
        },
        {
            title: "Fixed Salary",
            children: [
                {
                    title: "Basic Pay",
                    dataIndex: "salary",
                    key: "salary"
                },
                {
                    title: "DA",
                    dataIndex: "da",
                    key: "da"
                },
                {
                    title: "HRA",
                    dataIndex: "hra",
                    key: "hra"
                },
                {
                    title: "WA",
                    dataIndex: "wa",
                    key: "wa"
                },
                {
                    title: "Leave Encashment",
                    dataIndex: "leaves",
                    key: "leaves"
                },
                {
                    title: "NFH",
                    dataIndex: "nfh",
                    key: "nfh"
                },
                {
                    title: "Total",
                    dataIndex: "total",
                    key: "total"
                },
            ]
        },
        {
            title: "Earnings",
            children: [
                {
                    title: "Basic Pay",
                    dataIndex: "salary",
                    key: "salary"
                },
                {
                    title: "DA",
                    dataIndex: "da",
                    key: "da"
                },
                {
                    title: "HRA",
                    dataIndex: "hra",
                    key: "hra"
                },
                {
                    title: "WA",
                    dataIndex: "wa",
                    key: "wa"
                },
                {
                    title: "Leave Encashment",
                    dataIndex: "leaves",
                    key: "leaves"
                },
                {
                    title: "NFH",
                    dataIndex: "nfh",
                    key: "nfh"
                },
                {
                    title: "Total",
                    dataIndex: "total",
                    key: "total"
                },
            ]
        },
        {
            title: "Deductions",
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
                {
                    title: "PT",
                    dataIndex: "pt",
                    key: "pt"
                },
                {
                    title: "Total Deduction",
                    dataIndex: "totalDeduction",
                    key: "totalDeduction"
                },
            ]
        },
        {
            title: "Net Salary",
            dataIndex: "netSalary",
            key: "netSalary"
        },
    ];

    const generateRegisterTable = (value) => {
        setSelectedMonth(value);
        setTableData([]);
        // setLoaderFlag(true);
        // getAttendanceData(value);
    }

    const getRegisterData = (selectedDate = selectedMonth) => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getClientRegisterDataUrl,
            params: {
                startDate: selectedDate?.startOf('month')?.toDate()?.toISOString(),
                endDate: selectedDate?.endOf('month')?.toDate()?.toISOString(),
                clientId: params?.id,
            }
        };
    }


    return (
        <div className="wage-register-container h-100 w-100 pb-4">
            <div className="d-flex flex-row justify-content-start mb-3">
                <DatePicker picker="month" onChange={generateRegisterTable} value={selectedMonth} />
            </div>
            {loaderFlag ?
                <Loader />
                :
                <div className="w-100">
                    <Table
                        dataSource={tableData}
                        columns={tableColumns}
                        pagination={false}
                        scroll={{ x: "100%" }}
                    />
                    <div className="w-100 mt-4 text-start">
                        <Button disabled={!selectedMonth} type='primary' onClick={() => { }}>Save</Button>
                    </div>
                </div>
            }
        </div>
    )
}

export default WageRegisterComponent;