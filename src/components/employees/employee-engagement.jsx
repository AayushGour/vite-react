import { Button, Form, Input, Radio, Select, TimePicker } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addEmployeeEngagementUrl, getClientsListUrl, getEmployeeEngagementListUrl } from '../utility/api-urls';
import Loader from '../utility/loader';
import "./employee-engagement.scss";
import { getComputedSalaryData, getPf } from '../utility/constants';

const EmployeeEngagementComponent = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const params = useParams();

    const [isClientsListLoading, setIsClientsListLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [loaderFlag, setLoaderFlag] = useState(false);

    const [historyList, setHistoryList] = useState([]);
    const [clientsList, setClientsList] = useState([]);
    const [selectedValue, setSelectedValue] = useState("standard");


    const handleSelectChange = (value) => {
        if (!!value && value?.includes("standard")) {
            setSelectedValue("standard");
        } else {
            setSelectedValue(value)
        }
    }

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
        setLoaderFlag(true);
        const { startTime, endTime, salary,
            washingAllowance,
            uniformCharges,
            pfConfig,
            additionalAllowance } = values;
        // const pf = getPf(selectedValue, values);
        const salaryDetails = getComputedSalaryData({
            salary,
            additionalAllowance,
            washingAllowance,
            uniformCharges,
            pfConfig: pfConfig || selectedValue
        })
        const payload = {
            // ...values,
            clientId: values?.clientId,
            employeeId: params?.id,
            agencyId: localStorage.getItem('agencyId'),
            startDate: values?.startDate,
            endDate: values?.endDate,
            startTime: startTime.format('HH:mm'),
            endTime: endTime.format('HH:mm'),
            salaryDetails: salaryDetails
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
        }).finally(() => {
            setLoaderFlag(false);
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
                <Form form={form} onFinish={onFinish} className="employee-engagement-form position-relative" disabled={clientsList?.length === 0}>
                    {loaderFlag ? <Loader className="overlay" /> : <></>}
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
                    <div className="salary-form">
                        <h4 className='w-100 text-start mb-3'>Salary Details</h4>
                        <div className="d-flex flex-row gap-4">
                            <Form.Item
                                name="salary"
                                label="Salary per month"
                                rules={[{ required: true, message: 'Please enter the Salary per month' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="additionalAllowance"
                                label="Additional Allowance"
                                rules={[{ required: true, message: 'Please enter the Additional Allowance' }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div className="d-flex flex-row gap-4">
                            <Form.Item
                                name="washingAllowance"
                                label="Washing Allowance"
                                rules={[{ required: true, message: 'Please enter the Washing Allowance' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="pfConfig"
                                label="PF Options"
                                rules={[{ required: true, message: 'Please enter the PF options' }]}
                            >
                                <Select value={selectedValue} onChange={handleSelectChange} mode={selectedValue === "standard" ? "" : "multiple"}>
                                    <Option value="standard">Standard</Option>
                                    <Option value="salary">Basic</Option>
                                    <Option value="bonus">Bonus</Option>
                                    <Option value="nfh">NFH</Option>
                                    <Option value="earnedLeave">Earned Leave Cost</Option>
                                </Select>
                            </Form.Item>

                            {/* <Form.Item
                                name="esi"
                                label="ESI"
                                rules={[{ required: true, message: 'Please enter the ESI' }]}
                            >
                                <Input />
                            </Form.Item> */}
                        </div>

                        <div className="d-flex flex-row gap-4">
                            {/* <Form.Item
                                name="pf"
                                label="Provident Fund"
                                rules={[{ required: true, message: 'Please enter the Provident Fund' }]}
                            >
                                <Input />
                            </Form.Item> */}

                            <Form.Item
                                name="uniformCharges"
                                label="Uniform Charges"
                                rules={[{ required: true, message: 'Please enter the Uniform Charges' }]}
                            >
                                <Input />
                            </Form.Item>

                        </div>
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