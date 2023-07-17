import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';

const EmployeeInsuranceForm = (props) => {
    const { Option } = Select;
    const [editMode, setEditMode] = useState(false);
    const onFinish = (values) => {
        console.log('Form values:', values);
    };

    return (
        <div className="employee-insurance-form-conainer">
            <Form className='details-form' onFinish={onFinish}>
                <Form.Item
                    name="insuranceNo"
                    label="Insurance No"
                    rules={[{ required: true, message: 'Please enter the Insurance No' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please enter the employee's full name" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="fatherHusbandName"
                    label="Father / Husband's Name"
                    rules={[{ required: true, message: 'Please enter the father/husband name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="dob"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please enter the date of birth' }]}
                >
                    <Input /* type="date"  */ />
                </Form.Item>

                <Form.Item
                    name="sex"
                    label="Sex"
                    rules={[{ required: true, message: 'Please select the gender' }]}
                >
                    <Select>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="maritalStatus"
                    label="Marital Status"
                    rules={[{ required: true, message: 'Please select the marital status' }]}
                >
                    <Select>
                        <Option value="single">Single</Option>
                        <Option value="married">Married</Option>
                        <Option value="divorced">Divorced</Option>
                        <Option value="widowed">Widowed</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="permanentAddress"
                    label="Permanent Address"
                    rules={[{ required: true, message: 'Please enter the permanent address' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    name="presentAddress"
                    label="Present Address"
                    rules={[{ required: true, message: 'Please enter the present address' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    name="branchOffice"
                    label="Branch Office / Dispensary"
                    rules={[{ required: true, message: 'Please enter the branch office/dispensary name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="secondary" onClick={() => setEditMode(true)}>
                        Edit
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default EmployeeInsuranceForm;