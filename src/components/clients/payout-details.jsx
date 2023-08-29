import React, { useEffect, useState } from 'react';
import DetailsFormComponent from '../utility/details-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getClientPaymentDetailsUrl } from '../utility/api-urls';

const PayoutDetailComponent = (props) => {
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [updatedValues, setUpdatedValues] = useState({});
    const [initialValues, setInitialValues] = useState({});

    const params = useParams();

    const payoutOptions = {
        "monthly": 1,
        "quarterly": 3,
        "half-yearly": 6,
        "annually": 12,
    }

    useEffect(() => {
        getClientPaymentDetails();
    }, [])


    const getClientPaymentDetails = async () => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getClientPaymentDetailsUrl,
            params: {
                agencyId: localStorage.getItem("agencyId"),
                clientId: params?.id,
            }
        }
        axios(config).then((resp) => {
            console.log(resp?.data);
            setInitialValues(resp?.data?.data);
            setUpdatedValues(resp?.data?.data);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong")
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    const removeSubstrings = (str) => str.replace(/Status|Payout|DueDate/gi, "");


    const modifyDateForPayout = (date, currentPayout, newPayout) => {
        let diff = 0;
        diff = payoutOptions[newPayout] - payoutOptions[currentPayout];
        console.log(diff, newPayout, currentPayout);
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + diff);
        return newDate;
    }

    const handleFormFieldsChange = (values) => {
        const newVals = { ...values };
        Object.entries(values)?.map(([key, value]) => {
            if (key?.includes("Payout")) {
                const dateVal = !isNaN(new Date(newVals[`${removeSubstrings(key)}DueDate`]).getTime()) ? newVals[`${removeSubstrings(key)}DueDate`] : initialValues?.editedDate;
                console.log("inLoop", dateVal, newVals[`${removeSubstrings(key)}DueDate`], initialValues?.editedDate)
                newVals[`${removeSubstrings(key)}DueDate`] = modifyDateForPayout(dateVal, updatedValues[key], value)
            }
        })
        console.log("after", newVals, values)
        setUpdatedValues(newVals);
    }


    const formFields = [
        {
            key: "esiStatus",
            name: "esiStatus",
            label: "ESI Status",
            rules: [{ required: true, message: "Please enter the ESI Status" }],
            type: "select",
            options: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
            ],
            editable: true
        },
        {
            key: "esiPayout",
            name: "esiPayout",
            label: "ESI Payout",
            rules: [{ required: true, message: "Please enter the ESI Payout" }],
            type: "select",
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half Yearly", value: "half-yearly" },
                { label: "Annually", value: "annually" }
            ],
            editable: true
        },
        {
            key: "esiDueDate",
            name: "esiDueDate",
            label: "ESI Due Date",
            rules: [{ required: true, message: "Please enter the ESI Due Date" }],
            type: "datePicker",
            editable: false
        },
        {
            key: "pfStatus",
            name: "pfStatus",
            label: "PF Status",
            rules: [{ required: true, message: "Please enter the PF Status" }],
            type: "select",
            options: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
            ],
            editable: true
        },
        {
            key: "pfPayout",
            name: "pfPayout",
            label: "PF Payout",
            rules: [{ required: true, message: "Please enter the PF Payout" }],
            type: "select",
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half Yearly", value: "half-yearly" },
                { label: "Annually", value: "annually" }
            ],
            editable: true
        },
        {
            key: "pfDueDate",
            name: "pfDueDate",
            label: "PF Due Date",
            rules: [{ required: true, message: "Please enter the PF Due Date" }],
            type: "datePicker",
            editable: false,
        },
        {
            key: "earnedLeaveStatus",
            name: "earnedLeaveStatus",
            label: "Earned Leave Status",
            rules: [{ required: true, message: "Please enter the Earned Leave Status" }],
            type: "select",
            options: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
            ],
            editable: true
        },
        {
            key: "earnedLeavePayout",
            name: "earnedLeavePayout",
            label: "Earned Leave Payout",
            rules: [{ required: true, message: "Please enter the Earned Leave Payout" }],
            type: "select",
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half Yearly", value: "half-yearly" },
                { label: "Annually", value: "annually" }
            ],
            editable: true
        },
        {
            key: "earnedLeaveDueDate",
            name: "earnedLeaveDueDate",
            label: "Earned Leave Due Date",
            rules: [{ required: true, message: "Please enter the Earned Leave Due Date" }],
            type: "datePicker",
            editable: false,
        },
        {
            key: "nfhStatus",
            name: "nfhStatus",
            label: "NFH Status",
            rules: [{ required: true, message: "Please enter the NFH Status" }],
            type: "select",
            options: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
            ],
            editable: true
        },
        {
            key: "nfhPayout",
            name: "nfhPayout",
            label: "NFH Payout",
            rules: [{ required: true, message: "Please enter the NFH Payout" }],
            type: "select",
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half Yearly", value: "half-yearly" },
                { label: "Annually", value: "annually" }
            ],
            editable: true
        },
        {
            key: "nfhDueDate",
            name: "nfhDueDate",
            label: "NfhDueDate",
            rules: [{ required: true, message: "Please enter the NfhDueDate" }],
            type: "datePicker",
            editable: false,
        },
        {
            key: "bonusStatus",
            name: "bonusStatus",
            label: "Bonus Status",
            rules: [{ required: true, message: "Please enter the Bonus Status" }],
            type: "select",
            options: [
                { label: "Paid", value: "paid" },
                { label: "Pending", value: "pending" },
            ],
            editable: true
        },
        {
            key: "bonusPayout",
            name: "bonusPayout",
            label: "Bonus Payout",
            rules: [{ required: true, message: "Please enter the Bonus Payout" }],
            type: "select",
            options: [
                { label: "Monthly", value: "monthly" },
                { label: "Quarterly", value: "quarterly" },
                { label: "Half Yearly", value: "half-yearly" },
                { label: "Annually", value: "annually" }
            ],
            editable: true
        },
        {
            key: "bonusDueDate",
            name: "bonusDueDate",
            label: "Bonus Due Date",
            rules: [{ required: true, message: "Please enter the Bonus Due Date" }],
            type: "datePicker",
            editable: false,
        }
    ]
    return (
        <div className="payout-details-component h-100 w-100">
            <DetailsFormComponent
                formItems={formFields}
                onFinish={(e) => console.log(e)}
                initialValues={initialValues}
                onFormChange={handleFormFieldsChange}
            />
        </div>
    )
}

export default PayoutDetailComponent;