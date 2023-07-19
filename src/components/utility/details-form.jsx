import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import EditableTable from './editable-table';

const DetailsFormComponent = (props) => {
    const { onFinish, initialValues, formItems, isEdit, extraButtons } = props;
    const [editMode, setEditMode] = useState(isEdit);
    const [form] = Form.useForm();
    const initialData = [
        { id: 1, name: 'John', dob: '1990-01-01', relationship: 'Spouse', residingWith: 'Yes', placeOfResidence: '' },
        { id: 2, name: 'Jane', dob: '1995-05-05', relationship: 'Child', residingWith: 'No', placeOfResidence: 'New York' }
    ]

    useEffect(() => {
        setEditMode(isEdit);
    }, [isEdit])

    useEffect(() => {
        return () => {
            form.resetFields();
        }
    }, [])

    useEffect(() => {
        return () => {
            form.resetFields();
        }
    }, [form])


    return (
        <Form className='details-form' onFinish={onFinish} initialValues={initialValues ?? {}}>
            <div className="w-100 text-end">
                <Button className='fs-1rem px-3 py-2 h-auto' type="secondary" onClick={() => {
                    form.resetFields();
                    setEditMode(!editMode)
                }}>
                    {!editMode ? "Edit" : "Cancel"}
                </Button>
                {extraButtons?.map((btn, ind) => btn)}
            </div>
            {formItems?.map((formItem, ind) => {
                if (formItem?.type === 'heading') {
                    return <h4 key={formItem?.key} className='w-100 text-start mb-3'>{formItem?.label}</h4>
                } else if (formItem?.type === "custom") {
                    return formItem?.component;
                }/*  else if (formItem?.type === "table") {
                    return <EditableTable key={formItem?.key} isEdit={editMode} />;
                } */
                let inputComponent;
                switch (formItem?.type) {
                    case 'input':
                        inputComponent = <Input className='fs-1rem' />;
                        break;
                    case 'textarea':
                        inputComponent = <Input.TextArea className='fs-1rem' />;
                        break;
                    case 'datePicker':
                        inputComponent = <Input className='fs-1rem' type='date' />;
                        break;
                    case 'select':
                        inputComponent = <Select className='fs-1rem' options={formItem?.options} />
                        break;
                    case 'table': {
                        inputComponent = <EditableTable key={formItem?.key} onChange={(e) => console.log(e)} isEdit={editMode} initialData={initialData} />
                        break;
                    }
                    default:
                        break;
                }

                return <Form.Item
                    key={formItem?.key}
                    rules={editMode ? formItem?.rules : []}
                    label={formItem?.label}
                    name={formItem?.name}
                    className={formItem?.className ?? ""}
                >
                    {!editMode ?
                        <span className='d-block w-100 fs-1rem text-start'>
                            {formItem?.type === "datePicker" ? new Date(initialValues?.[formItem?.name]).toLocaleDateString() : formItem?.type === "table" ? inputComponent : initialValues?.[formItem?.name] || "-"}</span>
                        :
                        inputComponent}
                </Form.Item>
            })}

            <Form.Item style={editMode ? { paddingLeft: "25%" } : {}}>
                <div className='d-flex flex-row justify-content-end gap-3 align-items-center w-100'>

                    {editMode ?
                        <Button className='fs-1rem px-3 py-2 h-auto' type="primary" htmlType="submit">
                            Submit
                        </Button>
                        : <></>}
                </div>
            </Form.Item>
        </Form>
    )
}

export default DetailsFormComponent;