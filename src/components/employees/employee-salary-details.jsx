import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../utility/details-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEmployeeDetails } from '../store/action';
import { getEmployeeByIdUrl, updateEmployeesSalaryDetailsUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import { SET_EMPLOYEE_DETAILS_DATA } from '../store/action-types';

const EmployeeSalaryDetailsComponent = (props) => {
    const [loaderFlag, setLoaderFlag] = useState(false)
    const params = useParams();
    const employeeDetails = useSelector((state) => state?.appReducer?.employeeDetails);
    const dispatch = useDispatch();

    const getEmployeeDetails = async (clear = false) => {
        // debugger
        if (Object.keys(employeeDetails)?.length === 0 || clear) {
            const config = {
                method: "get",
                url: getEmployeeByIdUrl,
                params: {
                    employeeId: params?.id
                }
            }
            return axios(config).then((resp) => {
                dispatch({ type: SET_EMPLOYEE_DETAILS_DATA, payload: resp?.data?.data })
                return resp?.data?.data;
            }).catch((e) => {
                console.error(e);
                toast.error(e?.response?.data?.message);
            }).finally(() => setLoaderFlag(false));
        }
    }

    useEffect(() => {
        getEmployeeDetails();
    }, [])

    const handleSubmitSalaryDetails = (salData) => {
        setLoaderFlag(true)
        const config = {
            method: "put",
            url: updateEmployeesSalaryDetailsUrl,
            data: {
                agencyId: localStorage.getItem('agencyId'),
                salaryDetails: [{ ...salData, _id: params?.id }]
            }
        }
        axios(config).then(async (resp) => {
            console.log(resp?.data);
            toast.success("Details updated successfully");
            getEmployeeDetails(true);

            // fetchEmployeeDetails(dispatch, params?.id).finally(() => setLoaderFlag(false));
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        })
    }


    const formItems = [
        {
            type: "heading",
            key: "heading",
            label: "Salary Details",
        },
        {
            key: "salary",
            name: "salary",
            label: "Salary per month",
            rules: [{ required: true, message: 'Please enter the Salary per month' }],
            type: "input",
            editable: true,
        },
        {
            key: "earnedLeave",
            name: "earnedLeave",
            label: "Earned Leave Cost",
            rules: [{ required: true, message: "Please enter the earned leave cost" }],
            type: "input",
            editable: true,
        },
        {
            key: "washingAllowance",
            name: "washingAllowance",
            label: "Washing Allowance",
            rules: [{ required: true, message: "Please enter the Washing Allowance" }],
            type: "input",
            editable: true,
        },
        {
            type: "heading",
            key: "heading",
            label: "Deductions",
        },
        {
            key: "esi",
            name: "esi",
            label: "ESI",
            rules: [{ required: true, message: "Please enter the ESI" }],
            type: "input",
            editable: true,
        },
        {
            key: "pf",
            name: "pf",
            label: "Provident Fund",
            rules: [{ required: true, message: "Please enter the Provident Fund" }],
            type: "input",
            editable: true,
        },
        {
            key: "uniformCharges",
            name: "uniformCharges",
            label: "Uniform Charges",
            rules: [{ required: true, message: "Please enter the Uniform Charges" }],
            type: "input",
            editable: true,
        },
        {
            key: "additionalAllowance",
            name: "additionalAllowance",
            label: "Additional Allowance",
            rules: [{ required: true, message: "Please enter the Additional Allowance" }],
            type: "input",
            editable: true,
        },
    ]

    return (
        <div className="employee-salary-details">
            {loaderFlag ?
                <Loader className="overlay" /> : <></>
            }
            <DetailsFormComponent
                formItems={formItems}
                onFinish={handleSubmitSalaryDetails}
                initialValues={employeeDetails?.salaryDetails}
            // hideEdit={true}
            // isEdit={editMode}
            // extraButtons={
            //     [
            //         <Button key={1} className='fs-1rem px-3 py-2 h-auto' type="secondary" onClick={() => {
            //             // form.resetFields();
            //             setEditMode(!editMode)
            //         }}> {!editMode ? "Edit" : "Cancel"}
            //         </Button>
            //     ]
            // }
            />
        </div>
    )
}

export default EmployeeSalaryDetailsComponent;