import { Button, Form, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import "./estimate.scss";
import SecondaryHeader from '../utility/secondary-header';
import { getComputedSalaryData, getPf } from '../utility/constants';

const { Option } = Select;

const EstimateComponent = (props) => {
    const [columns, setColumns] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

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
    ]

    const handleAddColumn = () => {
        if (selectedOption) {
            setColumns(prevColumns => [...prevColumns, { id: `${new Date().getTime()}-${prevColumns?.length + 1}`, designation: selectedOption, ...rows?.reduce((acc, cur) => ({ ...acc, [cur?.dataKey]: 0 }), {}) }]);
        }
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleColumnsChange = (column) => {
        const newColumns = columns?.filter((e) => e?.id !== column?.id);
        newColumns.push(column);
        console.log(newColumns)
        setColumns(newColumns);
    }

    const deleteColumn = (id) => {
        setColumns((prev) => prev?.filter((col) => col?.id !== id));
    }

    return (
        <div className='px-5 py-4 sales-container'>
            <SecondaryHeader title='Estimate' />
            <Form layout='vertical' className="w-100 d-flex flex-row justify-content-start gap-3 align-items-center">
                <Form.Item label="Select a designation" className='w-15 text-start'>
                    <Select value={selectedOption} placeholder="Select a designation" onChange={handleOptionChange}>
                        <Option value="LADY GUARD">LADY GUARD</Option>
                        <Option value="HEAD GUARD">HEAD GUARD</Option>
                        <Option value="SECURITY SUPERVISOR">SECURITY SUPERVISOR</Option>
                        <Option value="SECURITY GUARD">SECURITY GUARD</Option>
                    </Select>
                </Form.Item>
                <Button onClick={handleAddColumn}>Add Column</Button>
            </Form>
            {columns?.length > 0 ?
                <div className="w-100 h-auto d-flex flex-row estimate-container">
                    <div className="d-flex flex-column align-items-start estimate-col">
                        <b className="d-inline-flex align-items-center px-2 col-name">PARTICULARS</b>
                        {rows?.map((row) => <span className={row?.dataKey === "total" ? "fw-bold" : ""} key={row?.dataKey}>{row?.title}</span>)}
                    </div>
                    <div className="w-85 d-flex flex-row estimate-cost-container overflow-x-auto">
                        {columns?.sort((a, b) => String(a?.id).localeCompare(String(b?.id)))?.map((col) => {
                            return <SaleColumnComponent deleteColumn={deleteColumn} key={col?.id} handleColumnsChange={handleColumnsChange} colData={col} />

                        })}
                    </div>
                </div> : <></>
            }
        </div >


    );
};

const SaleColumnComponent = ({ colData, handleColumnsChange, deleteColumn }) => {
    const [columnData, setColumnData] = useState(colData);
    const [selectedValue, setSelectedValue] = useState("standard");

    useEffect(() => {
        handleInputChange("pf", 0);
    }, [selectedValue])

    const handleInputChange = (key, val, id) => {
        console.log(key, val)
        const newColumn = { ...columnData, [key]: val }
        newColumn.pf = getPf(selectedValue, newColumn);
        const computedData = getComputedSalaryData(newColumn)
        setColumnData(computedData);
        handleColumnsChange(computedData)
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

    return (<div className="w-15 d-flex flex-column align-items-start estimate-col">
        <div className="col-title px-2 d-inline-flex flex-row justify-content-between align-items-center w-100">
            <b>{columnData?.designation}</b>
            <button className='delete-btn' onClick={() => deleteColumn(colData?.id)}>
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
                    return <span><Input min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} value={val} key={columnData?.id + key} /></span>;
                case "additionalAllowance":
                    return <span><Input min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} value={val} key={columnData?.id + key} /></span>;
                case "washingAllowance":
                    return <span><Input min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} value={val} key={columnData?.id + key} /></span>;
                case "subTotalA":
                    return <span>{Number(columnData?.salary) + Number(columnData?.additionalAllowance) + Number(columnData?.washingAllowance)}</span>;
                case "pf":
                    return <span className='d-flex flex-row justify-content-between'>
                        <span>{columnData?.pf}</span>
                        <Select defaultValue={"standard"} className='w-80' value={selectedValue} onChange={handleSelectChange} mode={selectedValue === "standard" ? "" : "multiple"}>
                            <Option value="standard">Standard</Option>
                            <Option value="salary">Basic</Option>
                            <Option value="bonus">Bonus</Option>
                            <Option value="nfh">NFH</Option>
                            <Option value="earnedLeave">Earned Leave Cost</Option>
                        </Select>
                    </span>;
                case "esi":
                    return <span>{columnData?.esi}</span>;
                case "bonus":
                    return <span>{columnData?.bonus}</span>;
                case "nfh":
                    return <span>{columnData?.nfh}</span>;
                case "earnedLeave":
                    return <span>{columnData?.earnedLeave}</span>;
                case "uniformCharges":
                    return <span ><Input className='w-49' min={0} type='number' onChange={(e) => handleInputChange(key, e?.target?.value, columnData?.id)} value={val} key={columnData?.id + key} />
                    </span>;
                case "subTotalB":
                    return <span>{columnData?.subTotalB}</span>
                case "relievingCharges":
                    return <span>{columnData?.relievingCharges}</span>;
                case "subTotalC":
                    return <span>{columnData?.subTotalC}</span>;
                case "serviceCharges":
                    return <span>{columnData?.serviceCharges}</span>;
                case "total":
                    return <span className='fw-bold'>{columnData?.total}</span>;
                default:
                    return "";
            }
        })}
    </div>)
}


export default EstimateComponent;