import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import DetailsFormComponent from '../utility/details-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getEmployeeInsuranceByIdUrl, updateEmployeeInsuranceUrl } from '../utility/api-urls';
import Loader from '../utility/loader';
import EditableTable from '../utility/family-editable-table';

const EmployeeInsuranceForm = (props) => {
    const params = useParams();
    const [initialValues, setInitialValues] = useState({});
    const [loaderFlag, setLoaderFlag] = useState(true);
    const [visible, setVisible] = useState(false);

    const onFinish = (values) => {
        setLoaderFlag(true);
        const data = Object.assign({}, values, { employeeId: params?.id });
        console.log('Form values:', data);
        const config = {
            method: "post",
            url: updateEmployeeInsuranceUrl,
            data: data,
        };
        axios(config).then((resp) => {
            console.log(resp?.data);
            // setInitialValues(values);
            getEmployeeInsuranceDetails(params?.id);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        }).finally(() => {
            setLoaderFlag(false);
        })
    };

    useEffect(() => {
        getEmployeeInsuranceDetails(params?.id);
    }, [])

    const getEmployeeInsuranceDetails = (emplId) => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getEmployeeInsuranceByIdUrl,
            params: {
                employeeId: emplId,
            }
        }
        axios(config)?.then((resp) => {
            const { employeeDetails, insuranceDetails } = resp?.data?.data;
            const proData = {
                name: employeeDetails?.name,
                guardian: employeeDetails?.guardian,
                insuranceNo: insuranceDetails?.insuranceNo,
                dob: new Date(employeeDetails?.dob)?.toISOString().split("T")[0],
                sex: employeeDetails.sex,
                maritalStatus: employeeDetails.maritalStatus,
                permanentAddress: employeeDetails?.permanentAddress,
                presentAddress: employeeDetails?.presentAddress,
                branchOffice: insuranceDetails?.branchOffice,
                dispensary: insuranceDetails?.dispensary,
                employerCode: insuranceDetails?.employerCode,
                appointmentDate: insuranceDetails?.appointmentDate,
                employersNameAddress: insuranceDetails?.employersNameAddress,
                nomineeName: employeeDetails?.nomineeName,
                nomineeRelationship: employeeDetails?.nomineeRelation,
                nomineeAddress: employeeDetails?.nomineeAddress,
                nomineeDob: employeeDetails?.nomineeDob,
                createdDate: employeeDetails?.createdDate,
                editedDate: employeeDetails?.editedDate,
                familyDetails: employeeDetails?.familyDetails,
            }
            setInitialValues(proData);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    const formItems = [
        {
            type: "heading",
            key: "heading",
            label: "Employee's Details",
        },
        {
            key: "insuranceNo",
            name: "insuranceNo",
            label: "Insurance No",
            rules: [{ required: true, message: 'Please enter the Insurance No' }],
            type: "input",
            editable: true,
        },
        {
            key: "name",
            name: "name",
            label: "Name",
            rules: [{ required: true, message: "Please enter the employee's full name" }],
            type: "input",
            editable: false,
        },
        {
            key: "guardian",
            name: "guardian",
            label: "Father / Husband's Name",
            rules: [{ required: true, message: 'Please enter the father/husband name' }],
            type: "input",
            editable: false,
        },
        {
            key: "dob",
            name: "dob",
            label: "Date of Birth",
            rules: [{ required: true, message: 'Please enter the Date of Birth' }],
            type: "datePicker",
            editable: false,
        },
        {
            key: "sex",
            name: "sex",
            label: "Sex",
            rules: [{ required: true, message: 'Please select the gender' }],
            type: "select",
            editable: false,
            options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }]
        },
        {
            key: "maritalStatus",
            name: "maritalStatus",
            label: "Marital Status",
            rules: [{ required: true, message: 'Please select Marital Status' }],
            type: "select",
            editable: false,
            options: [{ label: "Single", value: "single" }, { label: "Married", value: "married" }, { label: "Divorced", value: "divorced" }, { label: "Widowed", value: "widowed" }]
        },
        {
            key: "permanentAddress",
            name: "permanentAddress",
            label: "Permanent Address",
            rules: [{ required: true, message: 'Please select the Permanent Address' }],
            type: "textarea",
            editable: false,
        },
        {
            key: "presentAddress",
            name: "presentAddress",
            label: "Present Address",
            rules: [{ required: true, message: 'Please select the Present Address' }],
            type: "textarea",
            editable: false,
        },
        {
            key: "branchOffice",
            name: "branchOffice",
            label: "Branch Office",
            rules: [{ required: true, message: 'Please enter the Branch Office' }],
            type: "input",
            editable: true,
        },
        {
            key: "dispensary",
            name: "dispensary",
            label: "Dispensary",
            rules: [{ required: true, message: 'Please enter the Dispensary' }],
            type: "input",
            editable: true,
        },
        {
            type: "heading",
            key: "heading",
            label: "Employer's Details",
        },
        {
            key: "employerCode",
            name: "employerCode",
            label: "Employer's Code No.",
            rules: [{ required: true, message: 'Please enter Employer\'s Code No.' }],
            type: "input",
            editable: true,
        },
        {
            key: "appointmentDate",
            name: "appointmentDate",
            label: "Date of Appointment",
            rules: [{ required: true, message: 'Please enter the Date of Appointment' }],
            type: "datePicker",
            editable: true,
        },
        {
            key: "employersNameAddress",
            name: "employersNameAddress",
            label: "Name & Address of employer",
            rules: [{ required: true, message: 'Please select the Name and Address of employer' }],
            type: "textarea",
            editable: true,
        },
        {
            type: "heading",
            key: "heading",
            label: "Details of Nominees U/S 71 of ESI Act 1948/Rule 56(2) of ESI (Central) Rules, 1950 for payment of cash benefit in the event of death",
        },
        {
            key: "nomineeName",
            name: "nomineeName",
            label: "Name",
            rules: [{ required: true, message: 'Please enter Name of nominee' }],
            type: "input",
            editable: false,
        },
        {
            key: "nomineeRelationship",
            name: "nomineeRelationship",
            label: "Relationship",
            rules: [{ required: true, message: 'Please enter relationship' }],
            type: "input",
            editable: false,
        },
        {
            key: "nomineeDob",
            name: "nomineeDob",
            label: "Nominee's Date of birth",
            rules: [{ required: true, message: 'Please enter Nominee\'s Date of birth' }],
            type: "datePicker",
            editable: false,
        },
        {
            key: "nomineeAddress",
            name: "nomineeAddress",
            label: "Address",
            rules: [{ required: true, message: 'Please enter Nominee\'s Address' }],
            type: "textarea",
            editable: false,
        },
        {
            type: "heading",
            key: "heading",
            label: "Family particulars of insured person",
        },
        {
            key: "familyDetails",
            name: "familyDetails",
            type: "table",
            className: "w-100 editable-table-wrapper",
            editable: false,
        },
    ]

    return (
        <div className="employee-insurance-form-conainer">
            {loaderFlag ? <Loader /> :
                Object.keys(initialValues)?.length > 0 ?
                    <>

                        <DetailsFormComponent
                            formItems={formItems}
                            initialValues={initialValues}
                            onFinish={onFinish}
                            hideEdit={true}
                            extraButtons={[
                                <Button key={1} className='fs-1rem ms-3 px-3 py-2 h-auto' type="secondary" onClick={() => setVisible(true)}>View ID Card</Button>
                            ]}
                        />
                        <Modal
                            title="ID Card"
                            visible={visible}
                            onCancel={() => { setVisible(false) }}
                            footer={null}
                        >
                            <div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Name:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.name || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Ins No:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.insuranceNo || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Date of appointment:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.appointmentDate || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Branch Office:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.branchOffice || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Dispensary:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.dispensary || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Employer's Code No.:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.employerCode || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Employer's Address:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.employersNameAddress || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Validity:</span>
                                    <span className='w-70 fs-1rem'>{new Date(new Date(initialValues?.createdDate).setMonth(new Date(initialValues?.createdDate).getMonth() + 3)).toISOString().split("T")?.[0] || "-"}</span>
                                </div>
                                <div className='d-flex flex-row align-items-center'>
                                    <span className='fs-1rem w-40 my-2 fw-bold'>Date:</span>
                                    <span className='w-70 fs-1rem'>{initialValues?.editedDate?.split("T")[0] || "-"}</span>
                                </div>
                            </div>
                        </Modal>
                    </>
                    : <h3>No Data Available</h3>
            }
        </div >
    )
}

export default EmployeeInsuranceForm;