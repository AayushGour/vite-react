import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { useParams } from 'react-router-dom';
import { getClientByIdUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import ClientDetailsComponent from './client-details';
import { Tabs } from 'antd';
import EmployeeInsuranceForm from '../employees/employee-insurance-form';
import PayoutDetailComponent from './payout-details';
import InvoiceComponent from './invoice';
import "./view-client.scss";
import EstimateComponent from '../main/estimate';
import EditEstimateComponent from './edit-estimate';
import AttendanceComponent from '../main/attendance';

const ViewClientComponent = (props) => {
    const params = useParams();

    const [clientData, setClientData] = useState({});
    const [loaderFlag, setLoaderFlag] = useState(true);

    useEffect(() => {
        getClientDetails(params?.id);
    }, [])

    const getClientDetails = (clientId) => {
        const config = {
            method: "get",
            url: getClientByIdUrl,
            params: {
                clientId
            }
        }
        axios(config).then((resp) => {
            setClientData(resp?.data?.data);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    const tabItems = [
        {
            key: '1',
            label: `Client Details`,
            children: <ClientDetailsComponent />,
        },
        // {
        //     key: '2',
        //     label: `Payout Details`,
        //     children: <PayoutDetailComponent />,
        // },
        {
            key: '3',
            label: "Invoice",
            children: <InvoiceComponent />,
        },
        {
            key: '4',
            label: "Estimate Details",
            children: <EditEstimateComponent clientData={clientData} estimateData={clientData?.estimateData} onChange={console.log} />,
        },
        {
            key: '5',
            label: "Attendance",
            children: <AttendanceComponent isAdmin={true} clientData={clientData} />,
        },
    ];

    return (
        <div className="view-client-container h-100 w-100 p-4">
            <SecondaryHeader goBack title="Client Details" />
            <Tabs
                items={tabItems}
                className='h-100 w-100 px-4'
                size='large'
            />
        </div>
    )
}

export default ViewClientComponent;