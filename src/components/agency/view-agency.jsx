import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import { useParams } from 'react-router-dom';
import { getAgencyByIdUrl, updateAgencyByIdUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../utility/loader';
import DetailsFormComponent from '../utility/details-form';

const ViewAgencyComponent = (props) => {
    const params = useParams();

    const [orgDetails, setOrgDetails] = useState({});
    const [loaderFlag, setLoaderFlag] = useState(true);

    useEffect(() => {
        getAgencyById(params?.id)
    }, []);


    const formItems = [
        {
            type: "heading",
            key: "heading",
            label: "Agency Details",
        },
        {
            key: "agencyName",
            name: "agencyName",
            label: "Agency Name",
            rules: [{ required: true, message: 'Please enter the Agency Name' }],
            type: "input",
            editable: true,
        },
        {
            key: "contactPerson",
            name: "contactPerson",
            label: "Contact Person",
            rules: [{ required: true, message: "Please enter the Contact Person's Name" }],
            type: "input",
            editable: true,
        },
        {
            key: "contactNumber",
            name: "contactNumber",
            label: "Contact Number",
            rules: [{ required: true, message: "Please enter the Contact Number" }],
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

    const getAgencyById = (id) => {
        const config = {
            method: "get",
            url: getAgencyByIdUrl,
            params: {
                agencyId: id
            }
        };
        axios(config).then((resp) => {
            setOrgDetails(resp?.data?.data);

        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        }).finally(() => {
            setLoaderFlag(false);
        })
    };

    const handleAgencyEdit = (values) => {
        setLoaderFlag(true);
        const payload = { ...values, agencyId: params?.id }
        const config = {
            method: "put",
            url: updateAgencyByIdUrl,
            data: payload
        };
        axios(config).then((resp) => {
            setOrgDetails(resp?.data?.data);
            toast.success("Agency Updated Successfully")
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    return (
        <div className="view-org-container h-100 w-100 px-5 py-4">
            <SecondaryHeader title="View Agency" />
            {loaderFlag ? <Loader />
                :
                <DetailsFormComponent
                    formItems={formItems}
                    initialValues={orgDetails}
                    onFinish={handleAgencyEdit}
                />
            }
        </div>
    )
}

export default ViewAgencyComponent;