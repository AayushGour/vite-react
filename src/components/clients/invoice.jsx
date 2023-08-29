import { Button, DatePicker, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { getClientInvoiceDetailsUrl } from '../utility/api-urls';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PdfPreview from '../utility/pdf-preview';
import { numberToWords } from '../utility/constants';

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

    const params = useParams();

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
                }
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
                }
            }


        ]
        setDocDefinition(docDef)
    }

    return (
        <div className="invoice-component h-100">
            <div className="d-flex flex-row justify-content-start mb-3">
                <DatePicker picker="month" onChange={setSelectedMonth} value={selectedMonth} />
                <Button className='ms-3' type='primary' onClick={getClientInvoiceDetails}>Submit</Button>
            </div>
            {Object.keys(invoiceDetails)?.length > 0 && invoiceDetails?.billData?.length > 0 ?
                <div className="w-100 h-100">
                    <PdfPreview className="w-100 h-100" docDefinition={{ content: docDefinition, styles: styles }} key={1} />
                </div>
                : <></>}
        </div>
    )
}

export default InvoiceComponent;