import React, { useState } from 'react';
import { Table, Input, Button, Space, DatePicker, Checkbox, Avatar } from 'antd';
import "./family-editable-table.scss";
import { useEffect } from 'react';

const ReferenceEditableTable = ({ initialData = [], onChange, isEdit, dataColumns }) => {
    const [data, setData] = useState(initialData);
    const [editingKey, setEditingKey] = useState('');
    const [currentEditing, setCurrentEditing] = useState(initialData);

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "_id",
            className: "d-none"
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            // editRender: (text, record) => <>
            //     {console.log(currentEditing)}
            //     <Input value={currentEditing?.name}
            //         onChange={(e) => handleReferenceFieldChange(e.target.value, record._id, 'name')}
            //     /></>,
            sorter: (a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
            render: (text, record) => <>
                {isEditing(record) ?
                    <Input value={currentEditing?.name}
                        onChange={(e) => handleReferenceFieldChange(e.target.value, record._id, 'name')}
                    />
                    :
                    <>
                        <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                            {record?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        {record?.name}
                    </>
                }
            </>,
            editable: true,
        },
        {
            title: 'Occupation',
            dataIndex: 'occupation',
            key: 'occupation',
            render: (text, record) => {
                if (isEditing(record)) {
                    return <Input value={currentEditing?.occupation}
                        onChange={(e) => handleReferenceFieldChange(e.target.value, record._id, 'occupation')}
                    />;
                }
                return <span>{text}</span>;
            },
            editable: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => {
                if (isEditing(record)) {
                    return <Input value={currentEditing?.address}
                        onChange={(e) => handleReferenceFieldChange(e.target.value, record._id, 'address')}
                    />;
                }
                return <span>{text}</span>;
            },
            editable: true,
        },
        // isEdit ?
        //     {
        //         title: 'Actions',
        //         dataIndex: 'actions',
        //         render: (_, record) => {
        //             const editable = isEdit;
        //             return (
        //                 <Space>
        //                     {editable ? (
        //                         <>
        //                             <Button type="primary" onClick={() => save(currentEditing, record._id)}>
        //                                 Save
        //                             </Button>
        //                             <Button onClick={() => cancel(record?._id)}>Cancel</Button>
        //                         </>
        //                     ) : (
        //                         <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
        //                             Edit
        //                         </Button>
        //                     )}
        //                 </Space>
        //             );
        //         },
        //     } : {},

    ]

    // const [columns, setColumns] = useState(colList);


    const isEditing = (record) => record?._id === editingKey;

    const edit = (record) => {
        console.log(record)
        setEditingKey(record._id);
        setCurrentEditing(data?.find((item) => item?._id == record?._id))
    };

    const handleReferenceFieldChange = (value, key, dataIndex) => {
        const datum = data.find((item) => item._id === key);
        // if (dataIndex === 'residingWith' && value) {
        //     setCurrentEditing({ ...datum, ...currentEditing, [dataIndex]: value, placeOfResidence: '' });
        // } else {
        setCurrentEditing({
            ...datum, ...currentEditing, [dataIndex]: value
        })
        // }
    };

    // useEffect(() => {
    //     console.log(columns)
    //     const colDat = columns?.map((col) => ({ ...col, render: isEditing(col) ? col?.editRender : col?.render }))
    //     setColumns(colDat)
    // }, [editingKey])


    const cancel = (key) => {
        setEditingKey('');
        const currData = data?.find((item) => item?._id === key);
        delete currData._id;
        if (Object.keys(currData)?.length === 0 || Object.values(currData)?.every((v) => !v)) {
            deleteRow(key)
        }
        setCurrentEditing({});
    };

    const save = (form, key) => {
        debugger
        const newData = [...data];
        const index = newData.findIndex((item) => key === item?._id);
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
        const newData = data.filter((item) => item._id !== key);
        setData(newData);
        setEditingKey('')
        setCurrentEditing({})
    };

    const addRow = () => {
        const newData = [...data];
        const newKey = data.length + 1;
        newData.push({ _id: newKey });
        setData(newData);
        setEditingKey(newKey);
        setCurrentEditing({})
    };


    const mergedColumns = columns?.filter((col) => Object.keys(col)?.length > 0)?.map((col) => {
        if (!col.editable) {
            return col;
        }
        const colDat = {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };

        return colDat
    });
    mergedColumns?.push(isEdit ? {
        title: 'Actions',
        dataIndex: 'actions',
        render: (_, record) => {
            const editable = isEditing(record);
            return (
                <Space>
                    {editable ? (
                        <>
                            <Button type="primary" onClick={() => save(currentEditing, record._id)}>
                                Save
                            </Button>
                            <Button onClick={() => cancel(record?._id)}>Cancel</Button>
                        </>
                    ) : (
                        <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Button>
                    )}
                    <Button onClick={() => deleteRow(record._id)}>Delete</Button>
                </Space>
            );
        },
    } : {})

    return (
        <div className='w-100'>
            {isEdit ?
                <div className="text-end w-100 mb-2">
                    <Button onClick={addRow}>Add Row</Button>
                </div>
                : <></>}
            <Table bordered dataSource={data} columns={mergedColumns?.filter((col) => Object.keys(col)?.length > 0)} rowClassName="editable-row" pagination={false} />
        </div>
    );
};

export default ReferenceEditableTable;