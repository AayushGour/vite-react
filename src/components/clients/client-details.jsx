import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClientByIdUrl, updateClientByIdUrl } from '../utility/api-urls';
import "./client-details.scss";
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import DetailsFormComponent from '../utility/details-form';


const ClientDetailsComponent = (props) => {
    const params = useParams();

    const [clientData, setClientData] = useState({});
    const [loaderFlag, setLoaderFlag] = useState(true);

    useEffect(() => {
        getClientDetails(params?.id);
    }, [])

    const formItems = [
        {
            type: "heading",
            key: "heading",
            label: "Client Name",
        },
        {
            key: "clientName",
            name: "clientName",
            label: "Client Name",
            rules: [{ required: true, message: 'Please enter the Client Name' }],
            type: "input",
            editable: true,
        },
        {
            key: "billingAddress",
            name: "billingAddress",
            label: "Billing ddress",
            rules: [{ required: true, message: 'Please enter the Billing ddress' }],
            type: "input",
            editable: true,
        },
        {
            key: "street",
            name: "street",
            label: "Street",
            rules: [{ required: true, message: 'Please enter the Street' }],
            type: "input",
            editable: true,
        },
        {
            key: "city",
            name: "city",
            label: "City",
            rules: [{ required: true, message: 'Please enter the City' }],
            type: "input",
            editable: true,
        },
        {
            key: "state",
            name: "state",
            label: "State",
            rules: [{ required: true, message: 'Please enter the State' }],
            type: "input",
            editable: true,
        },
        {
            key: "country",
            name: "country",
            label: "Country",
            rules: [{ required: true, message: 'Please enter the Country' }],
            type: "input",
            editable: true,
        },
        {
            key: "postalCode",
            name: "postalCode",
            label: "Postal code",
            rules: [{ required: true, message: 'Please enter the Postal code' }],
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
            key: "gstin",
            name: "gstin",
            label: "GSTIN",
            rules: [{ required: true, message: 'Please enter the GSTIN' }],
            type: "input",
            editable: true,
        },
        {
            key: "contactPerson",
            name: "contactPerson",
            label: "Contact Person",
            rules: [{ required: true, message: 'Please enter the Contact Person' }],
            type: "input",
            editable: true,
        },
        {
            key: "contactNumber",
            name: "contactNumber",
            label: "Contact Number",
            rules: [{ required: true, message: 'Please enter the Contact Number' }],
            type: "input",
            editable: true,
        },
        {
            key: "contactEmail",
            name: "contactEmail",
            label: "Contact Email ID",
            rules: [{ required: true, message: 'Please enter the Contact Email ID' }],
            type: "input",
            editable: false,
        },
        // {
        //     key: "gstin",
        //     name: "gstin",
        //     label: "GSTIN",
        //     rules: [{ required: true, message: 'Please enter the GSTIN' }],
        //     type: "input",
        //     editable: true,
        // },
    ];

    const updateClient = (values) => {
        setLoaderFlag(true);
        const payload = {
            clientId: params?.id,
            ...values,
        }
        delete payload.contactEmail;
        const config = {
            method: "put",
            url: updateClientByIdUrl,
            data: payload,
        }
        axios(config).then((res) => {
            setClientData(res?.data?.data);
            toast.success("Client Updated Successfully")
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong")
        }).finally(() => {
            setLoaderFlag(false);
        });
    }

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

    return (
        loaderFlag ? <Loader /> :
            <div className="client-details-container pb-3">
                <DetailsFormComponent
                    formItems={formItems}
                    onFinish={(e) => { updateClient(e) }}
                    initialValues={clientData}
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

export default ClientDetailsComponent;