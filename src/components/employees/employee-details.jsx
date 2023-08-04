import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Input, Space, Table } from 'antd';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployeeByIdUrl, updateEmployeeDetailsUrl } from '../utility/api-urls';
import Loader from '../utility/loader';
import DetailsFormComponent from '../utility/details-form';
import ReferenceEditableTable from '../utility/reference-editable-table';

const EmployeeDetailsComponent = (props) => {
    const params = useParams();

    const [employeeData, setEmployeeData] = useState({});
    const [loaderFlag, setLoaderFlag] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [currentEditing, setCurrentEditing] = useState({});
    const [initialData, setInitialData] = useState({});

    const edit = (record) => {
        setEditingKey(record._id);
        setCurrentEditing(employeeData?.references?.find((item) => item?._id == record?._id))
    };

    const cancel = (key) => {
        setEditingKey('');
        const currData = employeeData?.references?.find((item) => item?._id === key);
        delete currData._id;

        setCurrentEditing({});
    };

    const handleReferenceFieldChange = (value, key, dataIndex) => {
        const datum = employeeData?.references.find((item) => item._id === key);
        if (dataIndex === 'residingWith' && value) {
            setCurrentEditing({ ...datum, ...currentEditing, [dataIndex]: value, placeOfResidence: '' });
        } else {
            setCurrentEditing({
                ...datum, ...currentEditing, [dataIndex]: value
            })
        }
    };

    const handleNomineeFieldChange = (value, key, dataIndex) => {
        const datum = employeeData?.nomineeDetails.find((item) => item._id === key);
        setCurrentEditing({ ...datum, ...currentEditing });
    };


    const save = (form, key) => {
        const newData = [...employeeData?.references];
        const index = newData.findIndex((item) => key === item._id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...form });
            setEmployeeData({ ...employeeData, references: newData });
            setEditingKey('');
            setCurrentEditing({})
        } else {
            newData.push(form);
            setEmployeeData({ ...employeeData, references: newData });
            setEditingKey('');
            setCurrentEditing({})
        }
    };
    const isEditing = (record) => record._id === editingKey;

    useEffect(() => {
        getEmployeeDetails(params?.id);
    }, [])

    const referenceColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editRender: (text, record) => <><Input value={currentEditing?.name}
                onChange={(e) => handleReferenceFieldChange(e.target.value, record._id, 'name')}
            /></>,
            sorter: (a, b) => a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
            render: (text, record) => <>
                <>
                    <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                        {record?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    {record?.name}
                </>
            </>,
            editable: true,
        },
        {
            title: 'Occupation',
            dataIndex: 'occupation',
            key: 'occupation',
            render: (text, record) => {
                if (editMode) {
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
                if (editMode) {
                    return <Input value={currentEditing?.address}
                        onChange={(e) => handleReferenceFieldChange(e.target.value, record._id, 'address')}
                    />;
                }
                return <span>{text}</span>;
            },
            editable: true,
        },
        // editMode ?
        //     {
        //         title: 'Actions',
        //         dataIndex: 'actions',
        //         render: (_, record) => {
        //             const editable = editMode;
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

    ];

    const nomineeColumns = [
        {
            title: 'Name',
            dataIndex: 'nomineeName',
            key: 'nomineeName',
            editRender: (text, record) => <>
                <Input value={currentEditing?.nomineeDetails?.nomineeName}
                    onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeName')}
                />
            </>,
            sorter: (a, b) => a?.nomineeName?.toLowerCase().localeCompare(b?.nomineeName?.toLowerCase()),
            render: (text, record) => <>

                <Avatar shape="square" size="small" style={{ backgroundColor: '#2245b8', marginRight: '0.8rem' }}>
                    {record?.nomineeName?.charAt(0).toUpperCase()}
                </Avatar>
                {record?.nomineeName || "-"}
            </>,
            editable: true,
        },
        {
            title: 'Relationship with Nominee',
            dataIndex: 'nomineeRelation',
            key: 'nomineeRelation',
            editRender: (text, record) => {
                return <Input value={currentEditing?.nomineeDetails?.nomineeRelation}
                    onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeRelation')}
                />;
            },
            render: (text, record) => {
                // if (editMode) {
                //     return <Input value={currentEditing?.nomineeDetails?.nomineeRelation}
                //         onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeRelation')}
                //     />;
                // }
                return <span>{text || "-"}</span>;
            },
            editable: true,
        },
        {
            title: 'Date of Birth',
            dataIndex: 'nomineeDob',
            key: 'nomineeDob',
            editRender: (text, record) => {
                return <Input value={currentEditing?.nomineeDetails?.nomineeDob}
                    onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeDob')}
                />;
            },
            render: (text, record) => {
                // if (editMode) {
                //     return <Input value={currentEditing?.nomineeDetails?.nomineeDob}
                //         onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeDob')}
                //     />;
                // }
                return <span>{text?.split("T")?.[0] || "-"}</span>;
            },
            editable: true,
        },
        {
            title: 'Address',
            dataIndex: 'nomineeAddress',
            key: 'nomineeAddress',
            editRender: (text, record) => {
                return <Input value={currentEditing?.nomineeDetails?.nomineeAddress}
                    onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeAddress')}
                />;
            },
            render: (text, record) => {
                // if (editMode) {
                //     return <Input value={currentEditing?.nomineeDetails?.nomineeAddress}
                //         onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'nomineeAddress')}
                //     />;
                // }
                return <span>{text || "-"}</span>;
            },
            editable: true,
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            editRender: (text, record) => <Input value={currentEditing?.nomineeDetails?.percentage}
                onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'percentage')}
            />,
            render: (text, record) => {
                // if (editMode) {
                //     return <Input value={currentEditing?.nomineeDetails?.percentage}
                //         onChange={(e) => handleNomineeFieldChange(e.target.value, record._id, 'percentage')}
                //     />;
                // }
                return <span>{text || "-"}</span>;
            },
            editable: true,
        },
        editMode ?
            {
                title: 'Actions',
                dataIndex: 'actions',
                render: (_, record) => {
                    const editable = editMode;
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
                        </Space>
                    );
                },
            } : {},

    ]

    const formItems = [
        {
            type: "heading",
            key: "heading",
            label: "Employee's Details",
        },
        {
            key: "employeeId",
            name: "employeeId",
            label: "Employee ID",
            rules: [{ required: true, message: 'Please enter the Employee No' }],
            type: "input",
            editable: false,
        },
        {
            key: "name",
            name: "name",
            label: "Name",
            rules: [{ required: true, message: "Please enter the employee's full name" }],
            type: "input",
            editable: true,
        },
        {
            key: "guardian",
            name: "guardian",
            label: "Father / Husband's Name",
            rules: [{ required: true, message: 'Please enter the father/husband name' }],
            type: "input",
            editable: true,
        },
        {
            key: "contactNumber",
            name: "contactNumber",
            label: "Contact Number",
            rules: [{ required: true, message: 'Please enter the contact number name' }],
            type: "input",
            editable: true,
        },
        {
            key: "dob",
            name: "dob",
            label: "Date of Birth",
            rules: [{ required: true, message: 'Please enter the Date of Birth' }],
            type: "datePicker",
            editable: true,
        },
        {
            key: "sex",
            name: "sex",
            label: "Sex",
            rules: [{ required: true, message: 'Please select the gender' }],
            type: "select",
            editable: true,
            options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }]
        },
        {
            key: "maritalStatus",
            name: "maritalStatus",
            label: "Marital Status",
            rules: [{ required: true, message: 'Please select Marital Status' }],
            type: "select",
            editable: true,
            options: [{ label: "Single", value: "single" }, { label: "Married", value: "married" }, { label: "Divorced", value: "divorced" }, { label: "Widowed", value: "widowed" }]
        },
        {
            key: "permanentAddress",
            name: "permanentAddress",
            label: "Permanent Address",
            rules: [{ required: true, message: 'Please select the Permanent Address' }],
            type: "textarea",
            editable: true,
        },
        {
            key: "presentAddress",
            name: "presentAddress",
            label: "Present Address",
            rules: [{ required: true, message: 'Please select the Present Address' }],
            type: "textarea",
            editable: true,
        },
        {
            key: "designation",
            name: "designation",
            label: "Designation",
            rules: [{ required: true, message: 'Please enter the Dispensary' }],
            type: "select",
            editable: true,
            options: [{ label: "Security Supervisor", value: "SECURITY SUPERVISOR" }, { label: "Head Guard", value: "HEAD GUARD" }, { label: "Security Guard", value: "SECURITY GUARD" }, { label: "Lady Guard", value: "LADY GUARD" }]
        },
        {
            key: "qualification",
            name: "qualification",
            label: "Qualification",
            rules: [{ required: true, message: 'Please enter Qualification' }],
            type: "input",
            editable: true,
        },
        {
            key: "experience",
            name: "experience",
            label: "Experience",
            rules: [{ required: true, message: 'Please select the Experience' }],
            type: "textarea",
            editable: true,
        },
        {
            key: "languages",
            name: "languages",
            label: "Languages Known",
            rules: [{ required: true, message: 'Please enter the Languages Known' }],
            type: "input",
            editable: true,
        },
        {
            key: "aadharNumber",
            name: "aadharNumber",
            label: "Aadhar Number",
            rules: [{ required: true, message: 'Please enter the Aadhar Number' }],
            type: "input",
            editable: true,
        },
        {
            key: "panNumber",
            name: "panNumber",
            label: "PAN Number",
            rules: [{ required: true, message: 'Please enter the PAN Number' }],
            type: "input",
            editable: true,
        },
        {
            key: "oldEsiNumber",
            name: "oldEsiNumber",
            label: "Old ESI Number",
            // rules: [{ required: true, message: 'Please enter the Old ESI Number' }],
            type: "input",
            editable: true,
        },
        {
            key: "idMarks",
            name: "idMarks",
            label: "Identification Marks",
            rules: [{ required: true, message: 'Please enter Identification Marks' }],
            type: "input",
            editable: true,
        },
        // {
        //     key: "nomineeName",
        //     name: "nomineeName",
        //     label: "Name",
        //     rules: [{ required: true, message: 'Please enter Name of nominee' }],
        //     type: "input",
        //     editable: true,
        // },
        // {
        //     key: "nomineeRelation",
        //     name: "nomineeRelation",
        //     label: "Relationship with Nominee",
        //     rules: [{ required: true, message: 'Please enter relationship with Nominee' }],
        //     type: "input",
        //     editable: true,
        // },
        // {
        //     key: "nomineeDob",
        //     name: "nomineeDob",
        //     label: "Date of Birth of Nominee",
        //     rules: [{ required: true, message: 'Please enter the Date of Birth of Nominee' }],
        //     type: "datePicker",
        //     editable: true,
        // },
        // {
        //     key: "nomineeAddress",
        //     name: "nomineeAddress",
        //     label: "Address",
        //     rules: [{ required: true, message: 'Please enter Nominee\'s Address' }],
        //     type: "textarea",
        //     editable: true,
        // },
        {
            type: "heading",
            key: "heading",
            label: "Nominee Details",
        },
        {
            key: "nomineeDetails",
            name: "nomineeDetails",
            // label: "Nominee Details",
            type: "nom-table",
            className: "w-100 editable-table-wrapper",
            editable: true,
        },
        {
            type: "heading",
            key: "heading",
            label: "References",
        },
        {
            key: "references",
            name: "references",
            // label: "References",
            type: "ref-table",
            className: "w-100 editable-table-wrapper",
            // component: <ReferenceEditableTable
            //     initialData={employeeData?.references}
            //     dataColumns={referenceColumns}
            //     pagination={false}
            //     isEdit={editMode}
            //     onChange={(e) => setCurrentEditing((prev) => ({ ...prev, references: e }))}

            // // onChange={(e) => setCurrentEditing((prev) => ({ ...prev, nomineeDetails: e }))}
            // />,
            editable: true,
        },
        {
            type: "heading",
            key: "heading",
            label: "Family Details",
        },
        {
            key: "familyDetails",
            name: "familyDetails",
            type: "table",
            className: "w-100 editable-table-wrapper",
            editable: true,
        },
    ]


    const getEmployeeDetails = (employeeId) => {
        const config = {
            method: "get",
            url: getEmployeeByIdUrl,
            params: {
                employeeId
            }
        }
        axios(config).then((resp) => {
            const empDat = {
                ...resp?.data?.data,
                nomineeName: resp?.data?.data?.nomineeDetails?.[0]?.nomineeName,
                nomineeRelation: resp?.data?.data?.nomineeDetails?.[0]?.nomineeRelation,
                nomineeDob: resp?.data?.data?.nomineeDetails?.[0]?.nomineeDob,
                nomineeAddress: resp?.data?.data?.nomineeDetails?.[0]?.nomineeAddress,
                percentage: resp?.data?.data?.nomineeDetails?.[0]?.percentage,
            }
            setEmployeeData(empDat);
            setInitialData(empDat);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    const updateEmployeeDetails = (formData) => {
        const mergedEmployeeData = { ...employeeData, ...formData };
        const payloadKeyList = [
            "name",
            "guardian",
            "contactNumber",
            "dob",
            "designation",
            "qualification",
            "experience",
            "permanentAddress",
            "presentAddress",
            "languages",
            "aadharNumber",
            "idMarks",
            "maritalStatus",
            // "nomineeName",
            // "nomineeRelation",
            // "nomineeDob",
            // "nomineeAddress",
            "oldEsiNumber",
            "familyDetails",
            "panNumber",
            "sex",
            "references",
            "nomineeDetails",
            "_id",
        ]
        const payload = Object.keys(mergedEmployeeData)
            .filter(key => payloadKeyList.includes(key))
            .reduce((acc, key) => {
                acc[key] = mergedEmployeeData[key];
                return acc;
            }, {});

        setEditMode(false);
        setLoaderFlag(true);
        const config = {
            method: "post",
            url: updateEmployeeDetailsUrl,
            data: payload,
        }
        axios(config).then((resp) => {
            setEmployeeData(resp?.data?.data);
            setInitialData(resp?.data?.data);
            toast.success("Employee Details updated Successfully")
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    return (
        loaderFlag ? <Loader /> :
            <div className="employee-details-container pb-3">
                <DetailsFormComponent
                    formItems={formItems}
                    onFinish={(e) => { updateEmployeeDetails(e) }}
                    initialValues={employeeData}
                    hideEdit={false}
                    isEdit={editMode}
                // extraButtons={
                //     [
                //         <Button key={1} className='fs-1rem px-3 py-2 h-auto' type="secondary" onClick={() => {
                //             navigate(`/manage-employees/appointment-letter/${params?.id}`)
                //         }}>Appointment Letter
                //         </Button>
                //     ]
                // }
                />
            </div>
    )
}

export default EmployeeDetailsComponent;