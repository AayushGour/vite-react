import React from 'react';

const EmployeeSalaryDetailsComponent = (props) => {

    const formItems = [
        {
            type: "heading",
            key: "heading",
            label: "Salary Details",
        },
        {
            key: "basicSalary",
            name: "basicSalary",
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
            key: "agencyAddress",
            name: "agencyAddress",
            label: "Agency Address",
            rules: [{ required: true, message: "Please enter the Agency Address" }],
            type: "textarea",
            editable: true,
        },
    ]

    return (
        <div className="employee-salary-details">

        </div>
    )
}

export default EmployeeSalaryDetailsComponent;