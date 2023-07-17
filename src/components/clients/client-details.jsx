import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClientByIdUrl } from '../utility/api-urls';
import "./client-details.scss";
import { toast } from 'react-toastify';
import Loader from '../utility/loader';


const ClientDetailsComponent = (props) => {
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

    return (
        loaderFlag ? <Loader /> :
            <div className="client-details-container pb-3">
                {/* <h4 className='w-100 text-start mb-3'>Client Details</h4> */}
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Client Name</span>
                    <span className='text-start col-8'>{clientData?.clientName}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Billing Address</span>
                    <span className='text-start col-8'>{clientData?.billingAddress}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Street</span>
                    <span className='text-start col-8'>{clientData?.street}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>City</span>
                    <span className='text-start col-8'>{clientData?.city}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>State</span>
                    <span className='text-start col-8'>{clientData?.state}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Country</span>
                    <span className='text-start col-8'>{clientData?.country}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Postal Code</span>
                    <span className='text-start col-8'>{clientData?.postalCode}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>PAN Number</span>
                    <span className='text-start col-8'>{clientData?.panNumber}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>GSTIN</span>
                    <span className='text-start col-8'>{clientData?.gstin}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Contact Person</span>
                    <span className='text-start col-8'>{clientData?.contactPerson}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Contact Number</span>
                    <span className='text-start col-8'>{clientData?.contactNumber}</span>
                </div>
                <div className="item-row row">
                    <span className='text-start fw-bold col-3'>Contact Email</span>
                    <span className='text-start col-8'>{clientData?.contactEmail}</span>
                </div>
            </div>

    )
}

export default ClientDetailsComponent;