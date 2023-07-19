import React, { useState } from 'react';
import { Table, Input, Button, Space, Form } from 'antd';
import "./editable-table.scss";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'date' ? <Input type="date" /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: `Please enter ${title}!` }]}>
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditableTable = (props) => {
    const { isEdit, initialData, onChange } = props;
    const [data, setData] = useState(initialData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.id === editingKey;

    const editRow = (record) => {
        setEditingKey(record.id);
    };

    const cancelEdit = () => {
        setEditingKey('');
    };

    const saveRow = (form, record) => {
        form.validateFields((error, values) => {
            if (error) {
                return;
            }

            const newData = [...data];
            const index = newData.findIndex((item) => record.id === item.id);

            if (index > -1) {
                const updatedRecord = { ...record, ...values };
                newData.splice(index, 1, updatedRecord);
                setData(newData);
                onChange(newData)
                setEditingKey('');
            }
        });
    };

    const columns = [
        {
            title: 'Serial Number',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
            editable: true,
        },
        {
            title: 'Relationship',
            dataIndex: 'relationship',
            key: 'relationship',
            editable: true,
        },
        {
            title: 'Residing With',
            dataIndex: 'residingWith',
            key: 'residingWith',
            editable: true,
        },
        {
            title: 'Place of Residence',
            dataIndex: 'placeOfResidence',
            key: 'placeOfResidence',
            editable: true,
        },
        isEdit ?
            {
                title: 'Action',
                key: 'action',
                render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
                        <Space>
                            <Button type="primary" onClick={() => saveRow(record)}>
                                Save
                            </Button>
                            <Button onClick={cancelEdit}>Cancel</Button>
                        </Space>
                    ) : (
                        <Button disabled={editingKey !== ''} onClick={() => editRow(record)}>
                            Edit
                        </Button>
                    );
                },
            } : {},
    ];


    const components = {
        body: {
            cell: EditableCell,
        },
    };


    const mergedColumns = columns?.filter((col) => Object.keys(col)?.length > 0).map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'dob' ? 'date' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleAddRow = () => {
        const newRow = { id: data.length + 1, name: '', dob: '', relationship: '', residingWith: '', placeOfResidence: '' };
        setData([...data, newRow]);
        setEditingKey(newRow.id);
    };

    return (
        <div>
            <div className="w-100 text-end">
                <Button type="primary" onClick={handleAddRow} style={{ marginBottom: 16 }}>
                    Add Row
                </Button>
            </div>
            <Table
                className='w-100 editable-table'
                components={components}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
                rowKey="id"
            />
        </div>
    );
};

export default EditableTable;