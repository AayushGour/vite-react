import React, { useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { Button, Form, Input } from 'antd';
import "./create-agency.scss";
import { createAgencyUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateAgencyComponent = (props) => {
    const navigate = useNavigate();

    const [loaderFlag, setLoaderFlag] = useState(false);

    const { Item } = Form;
    const onFinish = (values) => {
        setLoaderFlag(true);
        const config = {
            method: "post",
            url: createAgencyUrl,
            data: values,
        }
        axios(config).then((resp) => {
            toast.success(resp?.data?.data?.message);
            navigate("/manage-agency");
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        }).finally(() => {
            setLoaderFlag(false);
        })
    };


    return (
        <div className="create-org-container w-100 h-100 px-5 py-4">
            <SecondaryHeader title="Onboard Agency" />
            <Form onFinish={onFinish} className='create-org-form'>
                <Item
                    label="Agency Name"
                    name="agencyName"
                    rules={[{ required: true, message: 'Please enter Agency name' }]}
                >
                    <Input />
                </Item>

                <Item
                    label="Contact Person"
                    name="contactPerson"
                    rules={[{ required: true, message: 'Please enter contact person' }]}
                >
                    <Input />
                </Item>

                <Item
                    label="Contact Number"
                    name="contactNumber"
                    rules={[{ required: true, message: 'Please enter contact number' }]}
                >
                    <Input />
                </Item>
                <Item
                    label="Account Number"
                    name="accountNumber"
                    rules={[{ required: true, message: 'Please enter Account number' }]}
                >
                    <Input />
                </Item>
                <Item
                    label="IFSC Code"
                    name="ifscCode"
                    rules={[{ required: true, message: 'Please enter IFSC Code' }]}
                >
                    <Input />
                </Item>
                <Item
                    label="Bank Name"
                    name="bankName"
                    rules={[{ required: true, message: 'Please enter Bank Name' }]}
                >
                    <Input />
                </Item>

                <Item
                    label="Email ID"
                    name="emailId"
                    rules={[
                        { required: true, message: 'Please enter email ID' },
                        { type: 'email', message: 'Please enter a valid email ID' },
                    ]}
                >
                    <Input />
                </Item>

                <Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                >
                    <Input.Password />
                </Item>

                <Item
                    label="Agency Address"
                    name="agencyAddress"
                    rules={[{ required: true, message: 'Please enter Agency address' }]}
                >
                    <Input.TextArea rows={4} />
                </Item>

                <Item className='btn-container'>
                    <Button loading={loaderFlag} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Item>
            </Form>
        </div>
    )
}

export default CreateAgencyComponent;