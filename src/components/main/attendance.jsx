import React, { useEffect, useRef, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { Table, DatePicker, TimePicker, Button, Select } from 'antd';
import dayjs from 'dayjs';
import "./attendance.scss"
import { getAttendanceDataUrl, markAttendanceUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';

const options = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'week-off', label: 'Week Off' },
];

const AttendanceComponent = (props) => {
    const { Option } = Select;


    // const selectRef = useRef(null);

    const [selectedWeek, setSelectedWeek] = useState(dayjs().startOf("week"));
    const [dataSource, setDataSource] = useState([]);
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [editedAttendance, setEditedAttendance] = useState([]);

    const handleTimeChange = (time, rowKey, date) => {
        // Handle time change and update the data accordingly
        console.log("Time changed:", time, rowKey, date);
    };

    const handleAttendanceSelectChange = (value, record, date) => {
        // Handle time change and update the data accordingly
        console.log("Time changed:", value, record, date);
        const attendanceDat = [...editedAttendance] || [];
        const attendanceIndex = attendanceDat?.findIndex((att) => att?._id === record?._id && att?.date === date);
        if (attendanceIndex !== -1) {
            attendanceDat[attendanceIndex].status = value;
        } else {
            attendanceDat.push({ ...record, status: value, date });
        }
        setEditedAttendance(attendanceDat);
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
            setEditedAttendance(resp?.data?.data?.attendance || [])
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
                    render: (text, record) => dayjs(record?.startDate) <= date && date <= dayjs(record?.endDate) ? <CustomSelectComponent
                        options={options}
                        className='w-100'
                        date={date}
                        record={record}
                        onChange={(value, record) => handleAttendanceSelectChange(value, record, date?.toDate())}
                    /> : "-",
                    key: `attendance-status_${formattedDate}`,
                    dataIndex: `attendance-status_${formattedDate}`

                    // children: [
                    //     {
                    //         title: "In Time",
                    //         dataIndex: `inTime_${formattedDate}`,
                    //         key: `inTime_${formattedDate}`,
                    //         render: (text, record) => (
                    //             <TimePicker
                    //                 value={text}
                    //                 onChange={(time, timeString) => handleTimeChange(timeString, record.key, selectedDate?.toDate())}
                    //                 format="HH:mm"
                    //             />
                    //         )
                    //     },
                    //     {
                    //         title: "Out Time",
                    //         dataIndex: `outTime_${formattedDate}`,
                    //         key: `outTime_${formattedDate}`,
                    //         render: (text, record) => (
                    //             <TimePicker
                    //                 value={text}
                    //                 onChange={(time, timeString) => handleTimeChange(timeString, record.key, selectedDate?.toDate())}
                    //                 format="HH:mm"
                    //             />
                    //         )
                    //     }
                    // ]
                }
            );
        });

        return columns;
    };

    const handleMarkAttendance = () => {
        const config = {
            method: "post",
            url: markAttendanceUrl,
            data: {
                attendanceData: editedAttendance,
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
                    <>
                        <Table className='attendance-table' bordered columns={generateColumns()} dataSource={dataSource} pagination={false} />
                        {dataSource?.length > 0 ?
                            <Button type='primary' onClick={handleMarkAttendance}>Submit</Button>
                            : <></>}
                    </>
                }
            </div>
        </div>
    )
}

export default AttendanceComponent;

const CustomSelectComponent = (props) => {
    const { record, onChange, date } = props;
    console.log(dayjs(record?.startDate) <= date, date <= dayjs(record?.endDate))
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
        const attendanceStatus = record?.attendance?.find((e) => e?.date === date?.toDate()?.toISOString());
        setSelectedValue(attendanceStatus?.status)
    }, [])

    const handleKeyDown = (event) => {
        const { key } = event;
        const keyOption = options?.find(
            (option) => option?.label?.toLowerCase()?.startsWith(key?.toLowerCase())
        );

        if (!!keyOption) {
            handleOnChange(keyOption.value)
            // selectRef.current.blur();
            // selectRef.current.focus();
            // selectRef.current.rcSelect.onKeyDown(event); // Trigger Antd's default behavior
            // selectRef.current.rcSelect.onOptionSelect(option); // Manually select the option
        }
    };
    const handleOnChange = (value) => {
        onChange(value, record);
        setSelectedValue(value)
    };
    return <Select
        value={selectedValue}
        className='w-100'
        onChange={(value) => handleOnChange(value)}
        onInputKeyDown={(e) => handleKeyDown(e)}
    >
        {options?.map((option) => (
            <Option key={option.value} value={option.value}>
                {option.label}
            </Option>
        ))}
    </Select>
}
