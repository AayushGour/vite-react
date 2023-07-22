import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import EditableTable from './family-editable-table';
import "./details-form.scss";

const DetailsFormComponent = (props) => {
    const { onFinish, initialValues, formItems, isEdit, extraButtons, hideEdit } = props;
    const [editMode, setEditMode] = useState(isEdit);
    const [form] = Form.useForm();

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
        <Form className='details-form' onFinish={(values) => { onFinish(values); setEditMode(false) }} initialValues={initialValues ?? {}}>
            <div className="w-100 text-end">
                {hideEdit ? <></> : <Button className='fs-1rem px-3 py-2 h-auto' type="secondary" onClick={() => {
                    form.resetFields();
                    setEditMode(!editMode)
                }}>
                    {!editMode ? "Edit" : "Cancel"}
                </Button>}
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
                        inputComponent = <EditableTable key={formItem?.key} isEdit={editMode && formItem?.editable} initialData={initialValues?.[formItem?.name]} />
                        break;
                    }
                    case 'custom': {
                        inputComponent = formItem?.component;
                        break;
                    }
                    default:
                        break;
                }

                return <Form.Item
                    key={formItem?.key}
                    rules={!editMode || !formItem?.editable ? [] : formItem?.rules}
                    label={formItem?.label}
                    name={formItem?.name}
                    className={formItem?.className ?? ""}
                >
                    {!editMode || !formItem?.editable ?
                        <span className='d-block w-100 fs-1rem text-start'>
                            {formItem?.type === "datePicker" ? (!!initialValues?.[formItem?.name] && new Date(initialValues?.[formItem?.name]) !== "Invalid Date" ? new Date(initialValues?.[formItem?.name]).toLocaleDateString() : "-") : formItem?.type === "table" ? inputComponent : initialValues?.[formItem?.name] || "-"}</span>
                        :
                        inputComponent}
                </Form.Item>
            })}

            <Form.Item className='w-100' style={editMode ? { paddingLeft: "100%", width: "100%" } : {}}>
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