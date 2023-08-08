import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { Table, DatePicker, TimePicker, Button } from 'antd';
import dayjs from 'dayjs';
import "./attendance.scss"
import { getAttendanceDataUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';

const AttendanceComponent = (props) => {

    const [selectedWeek, setSelectedWeek] = useState(dayjs().startOf("week"));
    const [dataSource, setDataSource] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);

    const handleTimeChange = (time, rowKey, date) => {
        // Handle time change and update the data accordingly
        console.log("Time changed:", time, rowKey, date);
    };

    const getAttendanceData = (selectedDate = selectedWeek) => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getAttendanceDataUrl,
            params: {
                startDate: selectedDate?.startOf('week').toDate(),
                endDate: selectedDate?.endOf('week').toDate(),
                clientId: localStorage?.getItem("clientId"),
            }
        };
        axios(config).then((resp) => {
            console.log(resp?.data);
            setDataSource(resp?.data?.data)
        }).catch((error) => {
            console.error(error)
            toast.error(error?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    useEffect(() => {
        handleWeekChange(dayjs());
    }, [])

    const handleWeekChange = (dates) => {
        // Handle week change and update the selectedWeek state
        const startOfWeek = dayjs(dates).startOf("week");
        const endOfWeek = dayjs(dates).endOf("week");

        const pickerInput = document.querySelector('.attendance-date-picker .ant-picker-input');
        pickerInput?.setAttribute("start-date", startOfWeek?.format("DD-MM-YYYY"));
        pickerInput?.setAttribute("end-date", endOfWeek?.format("DD-MM-YYYY"));

        setSelectedWeek(startOfWeek);
        generateColumns(startOfWeek);
        getAttendanceData(startOfWeek);
    };

    const generateColumns = (selectedDate = selectedWeek) => {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const columns = [
            {
                title: "Employee Name",
                dataIndex: "employeeName",
                key: "employeeName"
            }
        ];

        daysOfWeek.forEach((day, index) => {
            const date = selectedDate.startOf("week").add(index, "day");
            const formattedDate = date.format("MMM DD");

            columns.push(
                {
                    title: `${day} ${formattedDate}`,
                    children: [
                        {
                            title: "In Time",
                            dataIndex: `inTime_${formattedDate}`,
                            key: `inTime_${formattedDate}`,
                            render: (text, record) => (
                                <TimePicker
                                    value={text}
                                    onChange={(time, timeString) => handleTimeChange(timeString, record.key, selectedDate?.toDate())}
                                    format="HH:mm"
                                />
                            )
                        },
                        {
                            title: "Out Time",
                            dataIndex: `outTime_${formattedDate}`,
                            key: `outTime_${formattedDate}`,
                            render: (text, record) => (
                                <TimePicker
                                    value={text}
                                    onChange={(time, timeString) => handleTimeChange(timeString, record.key, selectedDate?.toDate())}
                                    format="HH:mm"
                                />
                            )
                        }
                    ]
                }
            );
        });

        return columns;
    };

    // const dataSource = [
    //     {
    //         key: "1",
    //         employeeName: "John Doe",
    //         // Add more employee data here
    //     },
    //     // Add more employees here
    // ];
    return (
        <div className="attendance-container h-100 w-100 px-5 py-4">
            <SecondaryHeader title="Attendance" />
            <div className='h-90 w-100'>
                <div className="w-100 d-flex flex-row justify-content-center mb-3 gap-3 align-items-center">
                    <Button title='Previous Week' onClick={() => handleWeekChange(selectedWeek?.subtract(1, 'week'))} ghost icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>} />
                    <DatePicker
                        id='attendance-date-picker'
                        className='attendance-date-picker'
                        picker="week"
                        onChange={handleWeekChange}
                        allowClear={false}
                        format="YYYY-MM-DD"
                        // disabledDate={disabledDate}
                        suffixIcon={<span className='fs-1_1rem'>to</span>}
                        defaultValue={selectedWeek}
                    />
                    <Button title="Next Week" onClick={() => handleWeekChange(selectedWeek?.add(1, "week"))} ghost icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>} />
                </div>
                {loaderFlag ? <Loader /> :
                    <Table className='attendance-table' bordered columns={generateColumns()} dataSource={dataSource} pagination={false} />
                }
            </div>
        </div>
    )
}

export default AttendanceComponent;