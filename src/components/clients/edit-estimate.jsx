import { Button, Form, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import "../main/estimate.scss";
import SecondaryHeader from '../utility/secondary-header';
import { getComputedSalaryData, getPf } from '../utility/constants';
import { updateEstimateUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';

const { Option } = Select;

const EditEstimateComponent = (props) => {
    const { estimateData, onChange: onEstimateChange, clientData } = props;
    const [columns, setColumns] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [isEditingServiceCharge, setIsEditingServiceCharge] = useState(false);
    const [serviceChargePercentage, setServiceChargePercentage] = useState(0.1); //value ranges from 0 to 1
    const [updateEstiateComponentKey, setUpdateEstiateComponentKey] = useState(new Date().getTime());
    useEffect(() => {
        setColumns(estimateData);
    }, [estimateData])

    useEffect(() => {
        setUpdateEstiateComponentKey(new Date().getTime());
    }, [columns])

    const rows = [
        {
            title: "Minimum Wage",
            dataKey: "salary",
        },
        {
            title: "Additional Allowance",
            dataKey: "additionalAllowance",
        },
        {
            title: "Washing Allowance",
            dataKey: "washingAllowance",
        },
        {
            title: "Sub Total A",
            dataKey: "subTotalA",
        },
        {
            title: "Provident Fund",
            dataKey: "pf",
        },
        {
            title: "ESI",
            dataKey: "esi",
        },
        {
            title: "Bonus",
            dataKey: "bonus",
        },
        {
            title: "National & Festival Holidays",
            dataKey: "nfh",
        },
        {
            title: "Earned Leave Cost",
            dataKey: "earnedLeave",
        },
        {
            title: "Uniform Charges",
            dataKey: "uniformCharges",
        },
        {
            title: "Sub Total B",
            dataKey: "subTotalB",
        },
        {
            title: "1/6th relieving charges",
            dataKey: "relievingCharges",
        },
        {
            title: "Sub Total C",
            dataKey: "subTotalC",
        },
        {
            title: "Service Charges",
            dataKey: "serviceCharges",
        },
        {
            title: "Total",
            dataKey: "total",
        },
        {
            title: "Number of Employees",
            dataKey: "noOfEmployees",
        },
        {
            title: "Grand Total",
            dataKey: "grandTotal",
        },

    ]

    const handleAddColumn = () => {
        if (selectedOption) {
            setColumns(prevColumns => [...prevColumns, {
                _id: `custom-${new Date().getTime()}-${prevColumns?.length + 1}`,
                status: "ACTIVE", clientId: clientData?._id,
                agencyId: clientData?.agencyId,
                designation: selectedOption,
                ...rows?.reduce((acc, cur) => {
                    let value;
                    switch (cur?.dataKey) {
                        case "noOfEmployees":
                            value = 1;
                            break;
                        default:
                            value = 0;
                            break;
                    }
                    return { ...acc, [cur?.dataKey]: value }
                }, {})
            }]);
        }
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleColumnsChange = (column) => {
        const currColumn = columns?.find((e) => e?._id === column?._id);
        if (!Object.entries(currColumn)?.map(([key, val]) => val === column?.[key])?.every((e) => e === true)) {
            const newColumns = columns?.filter((e) => e?._id !== column?._id);
            newColumns.push(column);
            setColumns(newColumns);
            onEstimateChange(newColumns)
        }
    }

    const deleteColumn = (id) => {
        setColumns((prev) => {
            const deletedColumn = prev?.find((col) => col?._id === id);
            deletedColumn.status = "DELETED";
            const filteredData = [...prev?.filter((col) => col?._id !== id), deletedColumn];
            return filteredData
        });
    }

    const handleServiceChargePercentageChange = (formData) => {
        console.log(formData);
        setServiceChargePercentage((Number(formData?.serviceChargePercentage) / 100).toFixed(2));
        setIsEditingServiceCharge(false);
    }

    const handleSaveEstimate = () => {
        const data = {
            clientId: clientData?.userId,
            agencyId: clientData?.agencyId,
            estimateData: columns
        }
        const config = {
            url: updateEstimateUrl,
            method: "post",
            data,
        }
        axios(config).then((resp) => {
            toast.success("Estimate Updated Successfully")
        }).catch((error) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        })
    }

    return (
        <div className='sales-container h-100 w-100'>
            <Form layout='vertical' className="w-100 d-flex flex-row justify-content-start gap-3 align-items-center">
                <Form.Item label="Select a designation" className='w-15 text-start'>
                    <Select value={selectedOption} placeholder="Select a designation" onChange={handleOptionChange}>
                        <Option disabled={!!columns?.find((elem) => elem?.designation === "LADY GUARD")} value="LADY GUARD">LADY GUARD</Option>
                        <Option disabled={!!columns?.find((elem) => elem?.designation === "HEAD GUARD")} value="HEAD GUARD">HEAD GUARD</Option>
                        <Option disabled={!!columns?.find((elem) => elem?.designation === "SECURITY SUPERVISOR")} value="SECURITY SUPERVISOR">SECURITY SUPERVISOR</Option>
                        <Option disabled={!!columns?.find((elem) => elem?.designation === "SECURITY GUARD")} value="SECURITY GUARD">SECURITY GUARD</Option>
                    </Select>
                </Form.Item>
                <Button onClick={handleAddColumn}>Add Column</Button>
            </Form>
            {columns?.length > 0 ?
                <div className="w-100 h-auto d-flex flex-row estimate-container">
                    <div className="d-flex flex-column align-items-start estimate-col">
                        <b className="d-inline-flex align-items-center px-2 col-name">PARTICULARS</b>
                        {rows?.map((row) => {
                            if (row?.dataKey === "serviceCharges" && !isEditingServiceCharge) {
                                return <span className="d-flex flex-row justify-content-between" key={row?.dataKey}>
                                    <div className="d-flex flex-row align-items-baseline gap-2">
                                        <span>{row?.title}</span>
                                        <small>({serviceChargePercentage * 100}%)</small>
                                    </div>
                                    <button onClick={() => setIsEditingServiceCharge(true)} className='border-0 bg-transparent p-1' title="Edit Service Charge">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                                    </button>
                                </span>
                            } else if (row?.dataKey === "serviceCharges" && isEditingServiceCharge) {
                                return <span key={row?.dataKey}>
                                    <Form onFinish={handleServiceChargePercentageChange} className="w-100 d-flex flex-row justify-content-between">
                                        <Form.Item
                                            name="serviceChargePercentage"
                                            className='mb-0'
                                            initialValue={serviceChargePercentage * 100}
                                        // rules={[
                                        //     { required: true, message: 'Please enter a value between 0 and 100' },
                                        //     { type: 'number', min: 0, max: 100, message: 'Value must be between 0 and 100' },
                                        // ]}
                                        >
                                            <Input type="number" min={0} max={100} placeholder="Enter a value between 0 and 100" defaultValue={serviceChargePercentage * 100} />
                                        </Form.Item>
                                        <Form.Item
                                            className='mb-0'
                                        >
                                            <Button title='Save' className='border-0 bg-transparent' htmlType="submit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </Button>
                                        </Form.Item>
                                    </Form>

                                </span>
                            } else {
                                return <span className={row?.dataKey === "total" ? "fw-bold" : ""} key={row?.dataKey}>{row?.title}</span>
                            }
                        })
                        }
                    </div>
                    <div key={updateEstiateComponentKey} className="w-85 d-flex flex-row estimate-cost-container overflow-x-auto">
                        {columns?.filter((e) => e?.status === "ACTIVE")?.sort((a, b) => String(a?.id).localeCompare(String(b?.id)))?.map((col) => {
                            return <SaleColumnComponent deleteColumn={deleteColumn} key={col?.id} handleColumnsChange={handleColumnsChange} colData={col} serviceChargePercentage={serviceChargePercentage} />

                        })}
                    </div>
                </div> : <></>
            }
            <div className="w-100 d-flex flex-row justify-content-start my-5 pb-5">
                <Button title='Save' type='primary' onClick={handleSaveEstimate}>Save</Button>
            </div>
        </div >


    );
};

const SaleColumnComponent = ({ colData, handleColumnsChange, deleteColumn, serviceChargePercentage }) => {
    const [columnData, setColumnData] = useState(colData);
    const [selectedValue, setSelectedValue] = useState("standard");

    useEffect(() => {
        handleInputChange("pf", 0);
    }, [selectedValue])

    useEffect(() => {
        handleInputChange("serviceChargePercentage", serviceChargePercentage);
    }, [serviceChargePercentage])

    const handleInputChange = (key, val, id) => {
        const newColumn = { ...columnData, [key]: val }
        newColumn.pf = getPf(selectedValue, newColumn);
        const computedData = getComputedSalaryData(newColumn)
        setColumnData(computedData);
        // handleColumnsChange(computedData)
    }

    const handleSelectChange = (value) => {
        let selVal = value;
        if (!!value && value?.includes("standard")) {
            setSelectedValue("standard");
            selVal = "standard";
        } else {
            setSelectedValue(value)
        }
        handleInputChange("pfConfig", selVal)
    }

    return (<div key={colData?._id} className="w-15 d-flex flex-column align-items-start estimate-col">
        <div style={{ order: "1" }} className="col-title px-2 d-inline-flex flex-row justify-content-between align-items-center w-100">
            <b>{columnData?.designation}</b>
            <button className='delete-btn' onClick={() => deleteColumn(colData?._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </div>
        {Object.entries(columnData)?.map(([key, val]) => {
            // const esi = (Number(columnData?.salary) + Number(columnData?.additionalAllowance)) * 0.325;
            // const pf = 15000 * 0.13;
            // const subTotalA = Number(columnData?.salary) + Number(columnData?.additionalAllowance) + Number(columnData?.washingAllowance);
            // const subTotalB = pf + esi + columnData?.uniformCharges;
            // const relievingCharges = (subTotalA + subTotalB) / 6;
            switch (key) {
                case "salary":
                    return <span style={{ order: "2" }} ><Input min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} onBlur={() => handleColumnsChange(columnData)} value={val} key={columnData?.id + key} /></span>;
                case "additionalAllowance":
                    return <span style={{ order: "3" }} ><Input min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} onBlur={() => handleColumnsChange(columnData)} value={val} key={columnData?.id + key} /></span>;
                case "washingAllowance":
                    return <span style={{ order: "4" }} ><Input min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} onBlur={() => handleColumnsChange(columnData)} value={val} key={columnData?.id + key} /></span>;
                case "subTotalA":
                    return <span style={{ order: "5" }} >{Number(columnData?.salary) + Number(columnData?.additionalAllowance) + Number(columnData?.washingAllowance)}</span>;
                case "pf":
                    return <span style={{ order: "6" }} className='d-flex flex-row justify-content-between'>
                        <span>{columnData?.pf}</span>
                        <Select defaultValue={"standard"} className='w-80' value={selectedValue} onChange={handleSelectChange} onBlur={() => handleColumnsChange(columnData)} mode={selectedValue === "standard" ? "" : "multiple"}>
                            <Option value="standard">Standard</Option>
                            <Option value="salary">Basic</Option>
                            <Option value="bonus">Bonus</Option>
                            <Option value="nfh">NFH</Option>
                            <Option value="earnedLeave">Earned Leave Cost</Option>
                        </Select>
                    </span>;
                case "esi":
                    return <span style={{ order: "7" }} >{columnData?.esi}</span>;
                case "bonus":
                    return <span style={{ order: "8" }} >{columnData?.bonus}</span>;
                case "nfh":
                    return <span style={{ order: "9" }} >{columnData?.nfh}</span>;
                case "earnedLeave":
                    return <span style={{ order: "10" }} >{columnData?.earnedLeave}</span>;
                case "uniformCharges":
                    return <span style={{ order: "11" }} ><Input className='w-49' min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} onBlur={() => handleColumnsChange(columnData)} value={val} key={columnData?.id + key} />
                    </span>;
                case "subTotalB":
                    return <span style={{ order: "12" }} >{columnData?.subTotalB}</span>
                case "relievingCharges":
                    return <span style={{ order: "13" }} >{columnData?.relievingCharges}</span>;
                case "subTotalC":
                    return <span style={{ order: "14" }} >{columnData?.subTotalC}</span>;
                case "serviceCharges":
                    return <span style={{ order: "15" }} >{columnData?.serviceCharges}</span>;
                case "total":
                    return <span style={{ order: "16" }} className='fw-bold'>{columnData?.total}</span>;
                case "noOfEmployees":
                    return <span style={{ order: "17" }} ><Input defaultValue={1} min={1} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} onBlur={() => handleColumnsChange(columnData)} value={val} key={columnData?.id + key} /></span>;
                case "grandTotal":
                    return <span style={{ order: "18" }} className='fw-bold'>{columnData?.grandTotal}</span>;
                default:
                    return "";
            }
        })}
    </div>)
}


export default EditEstimateComponent;