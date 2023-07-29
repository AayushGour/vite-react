import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEmployeeDetails } from '../store/action';
import { convertImageToBase64 } from '../utility/file-convertors';
import EPFLogo from "../../assets/img/EPFO_Logo.png";
import PdfPreview from '../utility/pdf-preview';

const ProvidentFundFormComponent = (props) => {
    const [docDefinition, setDocDefinition] = useState([]);
    const dispatch = useDispatch();
    const params = useParams();

    const styles = {
        regular: {
            fontSize: 12,
            font: "Helvetica"
        },
        pageTitle: {
            fontSize: 16,
            bold: true,
            font: "Times-New-Roman"
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

    const constructDocDefinition = async (values) => {
        const employeeDetails = await fetchEmployeeDetails(dispatch, params?.id);
        console.log(employeeDetails);
        const base64Img = await convertImageToBase64(EPFLogo);
        const docDef = [
            {
                columns: [
                    {
                        image: base64Img,
                        width: 80,
                    },
                    {
                        text: ["EMPLOYEES PROVIDENT FUND ORGANISATION\n", {
                            text: "NOMINATION AND DECLARATION FORM\nFOR UNEXEMPTED / EXEMPTED ESTABLISHMENTS",
                            fontSize: 13,
                        }],
                        style: "pageTitle",
                        lineHeight: 1.5,
                        // marginLeft: 20,
                        alignment: "center"
                    }
                ]
            },

            {
                marginTop: 20,
                marginBottom: 20,
                // alignment: "center",
                text: "Declaration and Nomination Form under the Employees, Provident Funds & Employee's Pension Scheme\n(Paragraph 33 & 61 of the Employees' Provident Fund Scheme, 1952 & Paragraph 18 of the Employees' Pension Scheme, 1995)",
                // columns: [
                //     {
                //         text: [
                //             `Employee Name: ${employeeDetails?.name}\n\n`,
                //             `Token Number: ${employeeDetails?.employeeId}\n\n`,
                //             `Department: ${values?.department ?? "SECURITY"}\n\n`,
                //             `Designation: ${employeeDetails?.designation}\n\n`,
                //         ],
                //         style: "regular"
                //     },
                //     {
                //         text: [
                //             `Date: ${values?.date ?? new Date()?.toISOString()?.split("T")[0]}\n\n`,
                //             `Address: ${employeeDetails?.presentAddress}\n`,
                //         ],
                //         style: "regular"
                //     },
                // ]
            },
            {
                // marginTop: 20,
                marginBottom: 20,
                text: [
                    `Name: ${employeeDetails?.name}\n\n`,
                    `Father's / Husband's Name: ${employeeDetails?.guardian}\n\n`,
                    `Date of birth: ${employeeDetails?.dob}\n\n`,
                    `Sex: ${employeeDetails?.sex?.charAt(0).toUpperCase() + employeeDetails?.sex?.slice(1)}\n\n`,
                    `Marital Status: ${employeeDetails?.maritalStatus}\n\n`,
                    `Account Number: ${values?.accountNumber ?? "-"}\n\n`,
                    `Permanent Address: ${employeeDetails?.permanentAddress ?? "-"}\n\n`,
                    `Present Address: ${employeeDetails?.presentAddress ?? "-"}\n\n`,
                ],
                style: "regular",
            },
            {
                text: "PART - A (EPS) Para 18",
                style: "subheader",
                alignment: "center",
                marginBottom: 15,
            },
            {
                text: `I hereby nominate the person (s) / cancel the nomination made by me previously and nominate the person(s), mentioned below to receive the amount standing to my credit in the Employees's Provident Fund, in the event of my death:\n\n`,
                lineHeight: 1.5
            },
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "auto", "auto"],
                    body: [
                        [{ text: 'Name', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }, { text: "Nominee's Relationship\nwith member", style: 'tableHeader' }, { text: "Date of birth", style: 'tableHeader' }],
                        [{ text: 'Sample value 1', style: "tableCell" }, { text: 'Sample value 2', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }],
                        [{ text: 'Sample value 1', style: "tableCell" }, { text: 'Sample value 2', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }],
                    ],
                },
                // layout: 'headerLineOnly',
                marginBottom: 20,
            },
            "Total amount of share of accumulation in Provident Fund to be paid to each nominee: 100%\n",
            "If the nominee is a minor, enter their name: -",
            "Relationship & address of the guardian who may receive the amount during the minority of nominee: -",
            {
                pageBreak: "before",
                ol: [
                    "*Certified that I have no family as defined in Para 2(g) of the Employees Provident Scheme, 1952 and should I acquire a family hereafter the above nomination should be deemed as cancelled.",
                    "*Certified that my father / mother is / are dependent upon me."
                ],
                marginTop: 10,
                marginBottom: 10,
            },

            "I hereby furnish below particulars of the members of my family who would be eligible to receive Widow / Widower / Children",
            {
                text: "PART - B (EPS) Para 18",
                style: "subheader",
                alignment: "center",
                marginBottom: 15,
                marginTop: 15,
            },
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "auto", "auto", "auto"],
                    body: [
                        [{ text: 'Name', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }, { text: "Relationship with member", style: 'tableHeader' }, { text: "Date of birth", style: 'tableHeader' }],
                        [{ text: 'Sample value 1', style: "tableCell" }, { text: 'Sample value 2', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }],
                        [{ text: 'Sample value 1', style: "tableCell" }, { text: 'Sample value 2', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }],
                    ],
                },
                // layout: 'headerLineOnly',
                marginBottom: 20,
            },
            "**Certified that I have no family, as defined in para 2 (vill) of Employees' Pension Scheme, 1995 and should I acquire a family hereafter I shall furnish particulars thereon in the above form.",
            {
                text: "Signature or thumb inpression of the subscriber",
                alignment: "right",
                marginTop: 50
            },
            {
                text: "FOR OFFICE USE ONLY",
                style: "subheader",
                alignment: 'center',
                marginTop: 20,
                marginBottom: 20,
            },
            {
                columns: [
                    "Date of joining E.P.F.: __/__/19__\nPast Service: ____ year\nDate of joining EPS: __/__/19__",
                    {
                        text: ["Entries Verified\n\n", "D.A.          S.S.          A.A.O.          "]
                    }
                ],
                marginBottom: 20,
            },
            "I hereby nominate the following person for receiving the monthly Pension (admissible under para 16(2)(g)(i)&(ii) in the event of my death without leaving any eligible family for receiving pension.\n\n",
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "auto", "auto", "auto"],
                    body: [
                        [{ text: 'Name', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }, { text: "Nominee's Relationship\nwith member", style: 'tableHeader' }, { text: "Date of birth", style: 'tableHeader' }],
                        [{ text: 'Sample value 1', style: "tableCell" }, { text: 'Sample value 2', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }],
                        [{ text: 'Sample value 1', style: "tableCell" }, { text: 'Sample value 2', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }, { text: 'Sample value 3', style: "tableCell" }],
                    ],
                },
                // layout: 'headerLineOnly',
                marginBottom: 20,
            },
            {
                columns: [
                    `Date: ${values?.date ?? new Date().toISOString().split("T")[0]}`,
                    { text: "Signature of Employee", alignment: "right" }
                ]
            },
            {
                text: "CERTIFICATE BY EMPLOYER",
                style: "subheader",
                alignment: 'center',
                pageBreak: "before",
                marginTop: 20,
                marginBottom: 20,
            },

            `Certified that the above declaration and nomination has been signed / thumb impressed before my by ${employeeDetails?.sex === "male" ? "Shri" : "Smt / Kum"} ${employeeDetails?.name?.toUpperCase()} employed in my establishment after ${employeeDetails?.sex === "male" ? "he" : "she"} read the entries / entries have been read over to ${employeeDetails?.sex === "male" ? "him" : "her"} by me and got confirmed by ${employeeDetails?.sex === "male" ? "him" : "her"}.\n\n`,
            {
                text: 'For EFFECTIVE COMPLY PVT LTD.\n\n\n\nAuthorized Signatory',
                bold: true,
                font: "Times-New-Roman",
                alignment: "right"
            },
        ];
        setDocDefinition(docDef);
    }

    useEffect(() => {
        constructDocDefinition();
    }, [])


    return (
        <div className="h-100 w-100 py-3 provident-fund-container d-flex flex-row">

            <PdfPreview className="w-60 h-100" docDefinition={{ content: docDefinition, styles: styles }} key={1} />

        </div>
    )
}

export default ProvidentFundFormComponent;