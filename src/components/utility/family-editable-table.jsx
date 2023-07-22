import React, { useState } from 'react';
import { Table, Input, Button, Space, DatePicker, Checkbox } from 'antd';
import "./family-editable-table.scss";

const EditableTable = ({ initialData = [], onChange, isEdit }) => {
    const [data, setData] = useState(initialData);
    const [editingKey, setEditingKey] = useState('');
    const [currentEditing, setCurrentEditing] = useState({});

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        setEditingKey(record.key);
        setCurrentEditing(data?.find((item) => item?.key == record?.key))
    };

    const cancel = (key) => {
        setEditingKey('');
        const currData = data?.find((item) => item?.key === key);
        delete currData.key;
        if (Object.keys(currData)?.length === 0 || Object.values(currData)?.every((v) => !v)) {
            deleteRow(key)
        }
        setCurrentEditing({});
    };

    const handleFieldChange = (value, key, dataIndex) => {
        const datum = data.find((item) => item.key === key);
        if (dataIndex === 'residingWith' && value) {
            setCurrentEditing({ ...datum, ...currentEditing, [dataIndex]: value, placeOfResidence: '' });
        } else {
            setCurrentEditing({
                ...datum, ...currentEditing, [dataIndex]: value
            })
        }
    };


    const save = (form, key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...form });
            setData(newData);
            setEditingKey('');
            setCurrentEditing({})
        } else {
            newData.push(form);
            setData(newData);
            setEditingKey('');
            setCurrentEditing({})
        }
        onChange(newData)
    };


    const deleteRow = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
        setEditingKey('')
        setCurrentEditing({})
    };

    const addRow = () => {
        const newData = [...data];
        const newKey = data.length + 1;
        newData.push({ key: newKey });
        setData(newData);
        setEditingKey(newKey);
        setCurrentEditing({})
    };

    const columns = [
        {
            title: 'Serial Number',
            dataIndex: 'key',
            editable: true,
            width: "5%",
            render: (text, record) => {
                // if (isEditing(record)) {
                //     return <Input value={currentEditing?.key}
                //         onChange={(e) => handleFieldChange(e.target.value, record.key, 'key')}
                //     />;
                // }
                return <span>{text}</span>;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
            width: "25%",
            render: (text, record) => {
                if (isEditing(record)) {
                    return <Input value={currentEditing?.name}
                        onChange={(e) => handleFieldChange(e.target.value, record.key, 'name')}
                    />;
                }
                return <span>{text}</span>;
            },
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            editable: true,
            width: "15%",
            render: (text, record) => {
                if (isEditing(record)) {
                    console.log(currentEditing?.dob, record)
                    return (
                        <Input className='fs-1rem' type='date' value={currentEditing?.dob?.includes("T") ? currentEditing?.dob?.split("T")?.[0] : currentEditing?.dob}
                            onChange={(e) => handleFieldChange(e.target.value, record.key, 'dob')}
                        />
                    );
                }
                return <span>{!!text && new Date(text) !== "Invalid Date" ? new Date(text).toISOString()?.split("T")?.[0] : "-"}</span>;
            },
        },
        {
            title: 'Relationship',
            dataIndex: 'relationship',
            editable: true,
            width: "15%",
            render: (text, record) => {
                if (isEditing(record)) {
                    return <Input value={currentEditing?.relationship}
                        onChange={(e) => handleFieldChange(e.target.value, record.key, 'relationship')}
                    />;
                }
                return <span>{text}</span>;
            },
        },
        {
            title: 'Residing With',
            dataIndex: 'residingWith',
            editable: true,
            width: "15%",
            // render: (text, record) => {
            //     if (isEditing(record)) {
            //         return <Input value={currentEditing?.residingWith}
            //             onChange={(e) => handleFieldChange(e.target.value, record.key, 'residingWith')}
            //         />;
            //     }
            //     return <span>{text}</span>;
            // },
            render: (text, record) => {
                const isEditingRow = isEditing(record);

                if (isEditingRow) {
                    return (
                        <Checkbox
                            checked={currentEditing?.residingWith}
                            onChange={(e) => handleFieldChange(e.target.checked, record.key, 'residingWith')}
                        />
                    );
                }

                return <span>{text ? 'Yes' : 'No'}</span>;
            },
        },
        {
            title: 'Place of Residence',
            dataIndex: 'placeOfResidence',
            editable: true,
            width: "25%",
            // render: (text, record) => {
            //     if (isEditing(record)) {
            //         return <Input value={currentEditing?.placeOfResidence}
            //             onChange={(e) => handleFieldChange(e.target.value, record.key, 'placeOfResidence')}
            //         />;
            //     }
            //     return <span>{text}</span>;
            // },
            render: (text, record) => {
                const isEditingRow = isEditing(record);
                const isResidingWithChecked = currentEditing.residingWith;

                if (isEditingRow && !isResidingWithChecked) {
                    return (
                        <Input
                            value={currentEditing?.placeOfResidence}
                            onChange={(e) => handleFieldChange(e.target.value, record.key, 'placeOfResidence')}
                        />
                    );
                }

                return <span>{text || "-"}</span>;
            },
        },
        isEdit ?
            {
                title: 'Actions',
                dataIndex: 'actions',
                render: (_, record) => {
                    const editable = isEditing(record);
                    return (
                        <Space>
                            {editable ? (
                                <>
                                    <Button type="primary" onClick={() => save(currentEditing, record.key)}>
                                        Save
                                    </Button>
                                    <Button onClick={() => cancel(record?.key)}>Cancel</Button>
                                </>
                            ) : (
                                <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    Edit
                                </Button>
                            )}
                            <Button onClick={() => deleteRow(record.key)}>Delete</Button>
                        </Space>
                    );
                },
            } : {},
    ];

    const mergedColumns = columns?.filter((col) => Object.keys(col)?.length > 0).map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className='w-100'>
            {isEdit ?
                <div className="text-end w-100 mb-2">
                    <Button onClick={addRow}>Add Row</Button>
                </div>
                : <></>}
            <Table bordered dataSource={data} columns={mergedColumns} rowClassName="editable-row" pagination={false} />
        </div>
    );
};

export default EditableTable;