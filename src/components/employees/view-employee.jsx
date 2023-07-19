import { Tabs } from 'antd';
import React from 'react';
import SecondaryHeader from '../utility/secondary-header';
import EmployeeDetailsComponent from './employee-details';
import EmployeeInsuranceForm from './employee-insurance-form';
import "./view-employee.scss";

const ViewEmployeeComponent = (props) => {
    const tabItems = [
        {
            key: '1',
            label: `Employee Details`,
            children: <EmployeeDetailsComponent />,
        },
        {
            key: '2',
            label: `Insurance Form`,
            children: <EmployeeInsuranceForm />,
        },
        {
            key: '3',
            label: `Tab 3`,
            children: `Content of Tab Pane 3`,
        },
    ];

    return (
        <div className="view-employee-container h-100 w-100 px-5 py-4">
            <SecondaryHeader goBack title="Employee Details" />
            <Tabs
                items={tabItems}
                className='h-100 w-100 px-4'
                size='large'
            />
        </div>
    )
}

export default ViewEmployeeComponent;