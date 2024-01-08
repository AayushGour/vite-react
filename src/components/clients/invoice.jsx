import { Button, DatePicker, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getClientInvoiceDetailsUrl } from '../utility/api-urls';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PdfPreview from '../utility/pdf-preview';
import { numberToWords } from '../utility/constants';
import { useRef } from 'react';

const styles = {
    regular: {
        fontSize: 12,
        font: "Helvetica"
    },
    pageTitle: {
        fontSize: 16,
        bold: true,
        // font: "Times-New-Roman"
    },
    header: {
        fontSize: 18,
        bold: true
    },
    subheader: {
        fontSize: 16,
        bold: true
    },
    tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        margin: [5, 5]
    },
    tableCell: {
        margin: [5, 5]
    }
}


const InvoiceComponent = (props) => {
    const [selectedMonth, setSelectedMonth] = useState();
    const [invoiceDetails, setInvoiceDetails] = useState({});
    const [docDefinition, setDocDefinition] = useState([]);
    const [generateInvoiceTableData, setGenerateInvoiceTableData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const params = useParams();
    const previewInvoiceContainerRef = useRef();

    const { Option } = Select;


    useEffect(() => {
        if (docDefinition?.length > 0) {
            previewInvoiceContainerRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [docDefinition])


    let generateInvoiceTableColumns = [
        {
            title: "Category",
            dataIndex: "designation",
            key: "designation",
            render: (text, record, index) => record?.isNew ?
                <Select placeholder="Select a designation" onChange={(value) => handleChangeInvoice(value, "designation", index)}>
                    <Option value="LADY GUARD">LADY GUARD</Option>
                    <Option value="HEAD GUARD">HEAD GUARD</Option>
                    <Option value="SECURITY SUPERVISOR">SECURITY SUPERVISOR</Option>
                    <Option value="SECURITY GUARD">SECURITY GUARD</Option>
                </Select> : text
        },
        {
            title: "Particulars",
            dataIndex: "particulars",
            key: "particulars",
            render: (text, record) => record?.designation !== "" ? `${record?.designation?.toLowerCase()?.replace(/\b\w/g, char => char.toUpperCase())} posted for ${record?.shifts} duties` : "-"
        },
        {
            title: "Rate",
            dataIndex: "rate",
            key: "rate",
            render: (text, record, index) => record?.isNew ? <Input type="number" onChange={(e) => handleChangeInvoice(e?.target?.value, "rate", index)} placeholder="Enter rate" defaultValue={Number(text)} /> : text
        },
        {
            title: "No. of Persons",
            dataIndex: "noOfEmployees",
            key: "noOfEmployees",
            render: (text, record, index) => record?.isNew ? <Input type="number" onChange={(e) => handleChangeInvoice(e?.target?.value, "noOfEmployees", index)} placeholder="Enter Number of persons" defaultValue={Number(text)} /> : text
        },
        {
            title: "Shifts",
            dataIndex: "shifts",
            key: "shifts",
            render: (text, record, index) => <Input onChange={(e) => handleChangeInvoice(e?.target?.value, "shifts", index)} type="number" placeholder="Enter number of shifts" defaultValue={Number(text)} />
        },
        {
            title: "Actions",
            dataIndex: "",
            key: "actions",
            render: (text, record, index) => <div>
                <Button onClick={() => handleRowDelete(index)} type='ghost' icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>} />
            </div>
        }
    ]

    const handleChangeInvoice = (value, updateKey, index) => {
        setGenerateInvoiceTableData((prev) => prev.map((e, ind) => ind === index ? { ...e, [updateKey]: value } : e));
        setDocDefinition([])
    }

    const handleRowDelete = (index) => {
        setGenerateInvoiceTableData((prev) => prev?.filter((e, i) => i !== index));
        setDocDefinition([])
    }

    const addRowForInvoice = () => {
        const daysInMonth = dayjs(selectedMonth).daysInMonth();

        setGenerateInvoiceTableData((prev) => ([...prev, {
            particulars: "",
            rate: 0,
            noOfEmployees: 1,
            shifts: daysInMonth,
            designation: "",
            isNew: true,
            amount: 0
        }]))
        setDocDefinition([])
    }

    const generateInvoiceTable = (selectedValue) => {
        const daysInMonth = dayjs(selectedValue).daysInMonth();
        const estimateData = props?.clientData?.estimateData;
        const invoiceTableData = Array.isArray(estimateData) && estimateData?.length > 0 ? estimateData?.map((est) => {
            const noOfPersons = est?.noOfEmployees || 1;
            const shifts = daysInMonth * (noOfPersons);
            return {
                particulars: `${est?.designation} posted for ${shifts} duties`,
                rate: est?.total || 0,
                noOfEmployees: noOfPersons,
                shifts: shifts,
                designation: est?.designation,
                isNew: false,
                amount: est?.grandTotal || 0
            }
        }) : [];
        setGenerateInvoiceTableData(invoiceTableData);
        setSelectedMonth(selectedValue);
    }

    const getClientInvoiceDetails = async () => {
        const config = {
            method: "get",
            url: getClientInvoiceDetailsUrl,
            params: {
                startDate: dayjs(selectedMonth).startOf('month').toISOString(),
                endDate: dayjs(selectedMonth).endOf('month').toISOString(),
                clientId: params?.id,
            }
        }

        axios(config).then((resp) => {
            setInvoiceDetails(resp?.data?.data);
            constructDocDefinition(resp?.data?.data)
            if (resp?.data?.data?.billData?.length === 0) {
                toast.info("No data available")
            }
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message || "Something went wrong");
        })
    }

    const constructDocDefinition = (data) => {
        let sumAmount = 0;
        const serviceData = data?.billData?.map((item, index) => {
            sumAmount += Number(((Number(item?.salaryData?.total) * Number(item?.daysWorked)) / Number(item?.totalDays)).toFixed(2));
            return [
                `${index + 1}`, item?.designation, { text: item?.salaryData?.total, alignment: "center" }, { text: item?.daysWorked, alignment: "center" }, { text: `${((Number(item?.salaryData?.total) * Number(item?.daysWorked)) / Number(item?.totalDays)).toFixed(2)}`, alignment: "right" }
            ];
        });
        const sgst = (Number(sumAmount) * 0.09).toFixed(2);
        const cgst = (Number(sumAmount) * 0.09).toFixed(2);
        const calcTotal = Number(sumAmount) + Number(sgst) + Number(cgst);
        const grandTotal = Math.round(Number(calcTotal));
        const roundOff = (grandTotal - Number(calcTotal)).toFixed(2);
        const docDef = [
            {
                text: "TAX INVOICE",
                style: "pageTitle",
                alignment: "center",
                lineHeight: 1.5,
                margin: [0, 8]
            },
            {
                table: {
                    headerRows: 0,
                    widths: ["*", "*"],
                    body: [
                        [
                            {
                                text: ["BILLING ADDRESS: \n", { text: `M/S. ${data?.clientData?.clientName?.toUpperCase()}\n`, bold: true, fontSize: 16 }, data?.clientData?.billingAddress, `\n${data?.clientData?.city}\n${data?.clientData?.state} - ${data?.clientData?.postalCode}`],
                                margin: [0, 5],
                                lineHeight: 1.5,
                            },
                            {
                                columns: [
                                    `Invoice Number:\nInvoice Date:\nPlace of supply:\nPAN No.:\nGSTIN:`,
                                    `Invoice Number\n${new Date().toISOString()?.split("T")[0]}\n${data?.clientData?.state}\n${data?.clientData?.panNumber}\n${data?.clientData?.gstin}`,
                                ],
                                margin: [0, 5],
                                lineHeight: 1.5,
                            },
                        ],
                        [
                            {
                                text: "We are Presenting our bill for the month of April - 2023 towards staff Provided to you. the details of the bill",
                                colSpan: "2",
                                lineHeight: 1.5,
                                margin: [0, 5]
                            }
                        ],
                    ]
                },
            },
            {
                table: {
                    widths: [35, "*", "*", "*", "*", /* "*" */],
                    headerRows: 1,
                    body: [
                        [
                            {
                                text: "S. No.",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Service",
                                border: [true, false, true, true]
                            },
                            // {
                            //     text: "No. of Staff",
                            //     border: [true, false, true, true]
                            // },
                            {
                                text: "Rate of Pay",
                                alignment: "center",
                                border: [true, false, true, true]
                            },
                            {
                                text: "No. of Duties",
                                alignment: "center",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Amount",
                                alignment: "right",
                                border: [true, false, true, true]
                            },
                        ],
                        ...serviceData
                    ],
                }

            },
            {
                table: {
                    headerRows: 0,
                    widths: ["*", "auto", "auto"],
                    body: [
                        [
                            {
                                text: `\n\n\nDetails for NEFT/RTGS transactions:\n${data?.agencyData?.agencyName?.toUpperCase()}\nA/C No.: ${data?.agencyData?.accountNumber}\nIFSC Code: ${data?.agencyData?.ifscCode}\nBank: ${data?.agencyData?.bankName}`,
                                border: [true, false, false, false],
                                lineHeight: 1.5,
                            },
                            {
                                text: `\n\n\nTotal:\nSGST@9%:\nCGST@9%:\n\nRound off:`,
                                lineHeight: 1.5,
                                border: [false, false, false, false]
                            },
                            {
                                text: `\n\n\n${sumAmount}\n${sgst}\n${cgst}\n\n${roundOff}`,
                                lineHeight: 1.5,
                                alignment: "right",
                                border: [false, false, true, false]
                            },
                        ],
                        [
                            {
                                text: `Amount in words: ${numberToWords(Number(grandTotal))}`,
                                lineHeight: 1.5,
                                border: [true, true, false, true],
                            },
                            {
                                text: "Grand Total:",
                                lineHeight: 1.5,
                                border: [true, true, false, true]
                            },
                            {
                                text: grandTotal,
                                lineHeight: 1.5,
                                alignment: "right",
                                border: [false, true, true, true]
                            },
                        ],
                        [
                            {
                                text: [{ text: "Payment Terms:\n", bold: true }, "1. Payment to be made as per Agreement Terms. Interest of 24% P.a\nshall be levied From the due Date onwards.\n2. All disputes are Subject to Tumakuru Jurisdiction Only."],
                                lineHeight: 1.5,
                                border: [true, true, false, true],
                            },
                            {
                                text: `For ${data?.agencyData?.agencyName?.toUpperCase()}\n\n\nAuthorized Signatory`,
                                // border: [false, true, true, true],
                                lineHeight: 1.5,
                                colSpan: "2",
                            },
                        ]
                    ]
                },
            }


        ]
        setDocDefinition(docDef)
    }

    const handlePreviewInvoice = () => {
        const { clientData } = props;
        const daysInMonth = dayjs(selectedMonth).daysInMonth();
        let sumAmount = 0;
        const serviceData = generateInvoiceTableData?.map((item, index) => {
            const totalAmount = Number(item?.shifts) * Number(item?.rate) / Number(daysInMonth);
            sumAmount += totalAmount;
            return [
                `${index + 1}`,
                item?.designation,
                item?.designation !== "" ? `${item?.designation?.toLowerCase()?.replace(/\b\w/g, char => char.toUpperCase())} posted for ${item?.shifts} duties` : "-",
                { text: item?.rate, alignment: "center" },
                { text: item?.noOfEmployees, alignment: "center" },
                { text: item?.shifts, alignment: "center" },
                { text: Number(item?.grandTotal || totalAmount).toFixed(2), alignment: "right" },
            ]
        })
        const sgst = (Number(sumAmount) * 0.09).toFixed(2);
        const cgst = (Number(sumAmount) * 0.09).toFixed(2);
        const calcTotal = Number(sumAmount) + Number(sgst) + Number(cgst);
        const grandTotal = Math.round(Number(calcTotal)).toFixed(2);
        const roundOff = (grandTotal - Number(calcTotal)).toFixed(2);
        let data = {
            agencyData: {
                agencyName: "Testing Industries",
                accountNumber: "8765434567890",
                ifscCode: "ABCD000121",
                bankName: "Swiss Bank",
            }
        }
        const docDef = [
            {
                text: "TAX INVOICE",
                style: "pageTitle",
                alignment: "center",
                lineHeight: 1.5,
                margin: [0, 8]
            },
            {
                table: {
                    headerRows: 0,
                    widths: ["*", "*"],
                    body: [
                        [
                            {
                                text: ["BILLING ADDRESS: \n", { text: `M/S. ${clientData?.clientName?.toUpperCase()}\n`, bold: true, fontSize: 16 }, clientData?.billingAddress, `\n${clientData?.city}\n${clientData?.state} - ${clientData?.postalCode}`],
                                margin: [0, 5],
                                lineHeight: 1.5,
                            },
                            {
                                table: {
                                    headerRows: 0,
                                    widths: ['auto', '*'],
                                    body: [
                                        [
                                            {
                                                text: "Invoice No.:",
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                            {
                                                text: "12345",
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                        ],
                                        [
                                            {
                                                text: "Invoice Date:",
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                            {
                                                text: `${new Date().toISOString()?.split("T")[0]}`,
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                        ],
                                        [
                                            {
                                                text: "Place of supply:",
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                            {
                                                text: `${clientData?.state || "-"}`,
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                        ],
                                        [
                                            {
                                                text: "PAN No:",
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                            {
                                                text: `${clientData?.panNumber || "-"}`,
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                        ],
                                        [
                                            {
                                                text: "GSTIN:",
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                            {
                                                text: `${clientData?.gstin || "-"}`,
                                                border: [false, false, false, false],
                                                lineHeight: 1.5,
                                            },
                                        ],
                                    ]
                                }
                            },
                            // {
                            //     columns: [
                            //         `Invoice Number:\nInvoice Date:\nPlace of supply:\nPAN No.:\nGSTIN:`,
                            //         `12345\n${new Date().toISOString()?.split("T")[0]}\n${clientData?.state}\n${clientData?.panNumber}\n${clientData?.gstin}`,
                            //     ],
                            //     margin: [0, 5],
                            //     lineHeight: 1.5,
                            // },
                        ],
                        [
                            {
                                text: `We are Presenting our bill for the month of ${dayjs(selectedMonth).toDate()?.toLocaleString('default', { month: 'long', year: "numeric" })} towards staff Provided to you. the details of the bill`,
                                colSpan: "2",
                                lineHeight: 1.5,
                                margin: [0, 5]
                            }
                        ],
                    ]
                }
            },
            {
                table: {
                    // widths: [35, "*", "*", "*", "*", "*", "*"],
                    headerRows: 1,
                    body: [
                        [
                            {
                                text: "S. No.",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Category",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Particulars",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Rate",
                                alignment: "center",
                                border: [true, false, true, true]
                            },
                            {
                                text: "No. of Staff",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Shifts",
                                alignment: "center",
                                border: [true, false, true, true]
                            },
                            {
                                text: "Amount",
                                alignment: "center",
                                border: [true, false, true, true]
                            },
                        ],
                        ...serviceData
                    ],
                }

            },
            {
                table: {
                    headerRows: 0,
                    widths: ["*", "auto", "auto"],
                    body: [
                        [
                            {
                                text: `\nDetails for NEFT/RTGS transactions:\n${data?.agencyData?.agencyName?.toUpperCase()}\nA/C No.: ${data?.agencyData?.accountNumber}\nIFSC Code: ${data?.agencyData?.ifscCode}\nBank: ${data?.agencyData?.bankName}`,
                                border: [true, false, false, false],
                                lineHeight: 1.5,
                            },
                            {
                                text: `\nTotal:\nSGST@9%:\nCGST@9%:\n\nRound off:`,
                                lineHeight: 1.5,
                                border: [false, false, false, false]
                            },
                            {
                                text: `\n${sumAmount.toFixed(2)}\n${sgst}\n${cgst}\n\n${roundOff}`,
                                lineHeight: 1.5,
                                alignment: "right",
                                border: [false, false, true, false]
                            },
                        ],
                        [
                            {
                                text: `Amount in words: ${numberToWords(Number(grandTotal))}`,
                                lineHeight: 1.5,
                                border: [true, true, false, true],
                            },
                            {
                                text: "Grand Total:",
                                lineHeight: 1.5,
                                border: [true, true, false, true]
                            },
                            {
                                text: grandTotal,
                                lineHeight: 1.5,
                                alignment: "right",
                                border: [false, true, true, true]
                            },
                        ],
                        [
                            {
                                text: [{ text: "Payment Terms:\n", bold: true }, "1. Payment to be made as per Agreement Terms. Interest of 24% P.a\nshall be levied From the due Date onwards.\n2. All disputes are Subject to Tumakuru Jurisdiction Only."],
                                lineHeight: 1.5,
                                border: [true, true, false, true],
                            },
                            {
                                text: `For ${data?.agencyData?.agencyName?.toUpperCase()}\n\n\nAuthorized Signatory`,
                                // border: [false, true, true, true],
                                lineHeight: 1.5,
                                colSpan: "2",
                            },
                        ]
                    ]
                }
            }
        ]
        setDocDefinition(docDef);
    }


    return (
        <div className="invoice-component h-100">
            <div className="d-flex flex-row justify-content-start mb-3">
                <DatePicker picker="month" onChange={generateInvoiceTable} value={selectedMonth} />

                {/* <Button className='ms-3' type='primary' onClick={getClientInvoiceDetails}>Submit</Button> */}
            </div>
            {!!selectedMonth && Object.keys(selectedMonth)?.length > 0 ?
                <div className='d-flex flex-column align-items-center'>
                    <Button disabled={!selectedMonth} className='ms-3 mb-2 align-self-end' type='primary' onClick={addRowForInvoice}>Add Row</Button>
                    <Table
                        className='w-100'
                        bordered
                        columns={generateInvoiceTableColumns}
                        dataSource={generateInvoiceTableData}
                        pagination={false}
                    />
                    <Button className='ms-3 mt-3 align-self-end' type='primary' onClick={handlePreviewInvoice}>Preview Invoice</Button>
                </div>
                : <></>}
            {/* {Object.keys(invoiceDetails)?.length > 0 && invoiceDetails?.billData?.length > 0 ? */}
            {docDefinition?.length > 0 ?
                <div ref={previewInvoiceContainerRef} className="w-100 h-100 my-3">
                    <PdfPreview className="w-100 h-100" docDefinition={{ content: docDefinition, styles: styles }} key={1} />
                </div>
                : <></>}
        </div>
    )
}

export default InvoiceComponent;