import { Button, Form, Input, Radio, Select, TimePicker } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addEmployeeEngagementUrl, getClientsListUrl, getEmployeeEngagementListUrl } from '../utility/api-urls';
import Loader from '../utility/loader';
import "./employee-engagement.scss";

const EmployeeEngagementComponent = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const params = useParams();

    const [isClientsListLoading, setIsClientsListLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    const [historyList, setHistoryList] = useState([]);
    const [clientsList, setClientsList] = useState([]);

    const isDateInRange = (startDate, endDate) => {
        const today = new Date();
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        return startDate <= today && today <= endDate;
    };

    const convertTimeFormat = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        return date.toLocaleTimeString(undefined, options);
    };

    const getEmployeeEngagementHistory = () => {
        setIsHistoryLoading(true);
        const config = {
            method: "get",
            url: getEmployeeEngagementListUrl,
            params: {
                agencyId: localStorage.getItem('agencyId'),
                employeeId: params?.id,
            }
        }
        axios(config).then((resp) => {
            console.log(resp?.data);
            setHistoryList(resp?.data?.data)
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setIsHistoryLoading(false)
        })
    }

    const onFinish = (values) => {
        const { startTime, endTime } = values;

        const payload = {
            ...values,
            employeeId: params?.id,
            agencyId: localStorage.getItem('agencyId'),
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
        }
        const config = {
            url: addEmployeeEngagementUrl,
            method: "post",
            data: payload,
        }
        axios(config).then((resp) => {
            console.log(resp?.data);
            toast.success("Employee Assigned")
            form.resetFields();
            // reset history
            getEmployeeEngagementHistory();
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        })
    };

    useEffect(() => {
        getClientsList();
        getEmployeeEngagementHistory();
        return () => {
            form.resetFields();
        }
    }, []);

    const getClientsList = () => {
        setIsClientsListLoading(true);
        const config = {
            method: "get",
            url: getClientsListUrl,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
                agencyId: localStorage.getItem("agencyId")
            }
        }
        axios(config).then((resp) => {
            setClientsList(resp?.data?.data?.data);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setIsClientsListLoading(false);
        })
    }

    return (
        <div className="employee-engagement-container h-85 w-100">
            {isClientsListLoading ? <Loader /> :
                <Form form={form} onFinish={onFinish} className="employee-engagement-form" disabled={clientsList?.length === 0}>
                    <h4 className='text-start pb-3'>Assign Employee</h4>
                    <Form.Item name="clientId" label="Client Name" rules={[{ required: true }]}>
                        <Select className='text-start' placeholder="Select client">
                            {clientsList?.map((client) => <Option key={client?._id} value={client?._id}>{client?.clientName}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <div className="d-flex flex-row gap-4">
                        <Form.Item className='w-49 time-picker-input' name="startTime" label="Start Time" rules={[{ required: true, message: 'Please select a start time' }]}>
                            <TimePicker className='w-100' format="h:mm A" />
                        </Form.Item>
                        <Form.Item className='w-49 time-picker-input' name="endTime" label="End Time" rules={[{ required: true, message: 'Please select an end time' }]}>
                            <TimePicker className='w-100' format="h:mm A" />
                        </Form.Item>
                    </div>
                    {/* <Form.Item name="shiftDetails" label="Shift Details" rules={[{ required: true }]}>
                        <Radio.Group className='d-flex flex-column gap-3 pt-1'>
                            <Radio value="morning">Morning Shift (6AM - 2PM)</Radio>
                            <Radio value="afternoon">Afternoon Shift (2PM - 10PM)</Radio>
                            <Radio value="night">Night Shift (10PM - 6AM)</Radio>
                        </Radio.Group>
                    </Form.Item> */}

                    <Form.Item className='d-flex flex-row justify-content-end mt-3'>
                        <Button className='fs-1rem px-3 py-2 h-auto' type="secondary" onClick={() => {
                            form.resetFields();
                        }}>
                            Reset
                        </Button>
                        <Button type="primary" htmlType="submit" className='ms-3 fs-1rem px-3 py-2 h-auto'>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            }
            <div className="history-container">
                {isHistoryLoading ? <Loader /> :
                    historyList?.length > 0 ?
                        historyList?.map((item) => {
                            return <div className={`history-card ${isDateInRange(item?.startDate, item?.endDate) ? "active" : ""}`} key={item?._id}>
                                <div className="card-header">
                                    <span>{new Date(item?.startDate).toLocaleDateString()} - {new Date(item?.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="card-body">
                                    <h5>{item?.clientName}</h5>
                                    {convertTimeFormat(item?.startTime)}-
                                    {convertTimeFormat(item?.endTime)}
                                </div>
                            </div>
                        }) :
                        <h4 className='mt-5 w-100 text-center'>No history available</h4>
                }
            </div>
        </div>
    )
}

export default EmployeeEngagementComponent;