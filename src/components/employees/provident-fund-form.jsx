import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEmployeeDetails } from '../store/action';
import { convertImageToBase64 } from '../utility/file-convertors';
import EPFLogo from "../../assets/img/EPFO_Logo.png";
import PdfPreview from '../utility/pdf-preview';
import { Button, Checkbox, Form, Input, Table } from 'antd';
import "./provident-fund-form.scss";

const ProvidentFundFormComponent = (props) => {
    const [docDefinition, setDocDefinition] = useState([]);
    const dispatch = useDispatch();
    const params = useParams();

    const [data, setData] = useState([
        {
            id: 1,
            name: 'John Doe',
            address: '123 Main St',
            relationship: 'Spouse',
            dob: '1990-01-01',
            percentage: "100"
        },
    ]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'nomineeName',
            editable: true,
            render: (text, record) => (
                <Input value={text} onChange={(e) => handleFieldChange(e?.target?.value, 'nomineeName', record.id)} />
            ),
        },
        {
            title: 'Address',
            dataIndex: 'nomineeAddress',
            editable: true,
            render: (text, record) => (
                <Input value={text} onChange={(e) => handleFieldChange(e?.target?.value, 'nomineeAddress', record.id)} />
            ),
        },
        {
            title: 'Relationship with Member',
            dataIndex: 'nomineeRelation',
            editable: true,
            render: (text, record) => (
                <Input value={text} onChange={(e) => handleFieldChange(e?.target?.value, 'nomineeRelation', record.id)} />
            ),
        },
        {
            title: 'Date of Birth',
            dataIndex: 'nomineeDob',
            editable: true,
            render: (text, record) => (
                <Input type="date" value={text?.split("T")?.[0]} onChange={(date) => handleFieldChange(date?.target?.value, 'nomineeDob', record.id)} />
            ),
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            editable: true,
            render: (text, record) => (
                <Input value={text} onChange={(e) => handleFieldChange(e?.target?.value, 'percentage', record.id)} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) =>
                data.length >= 1 ? (
                    <Button
                        type="link"
                        className='border-0'
                        onClick={() => handleDelete(record.id)}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                    />
                ) : null,
        },
    ];

    const handleFieldChange = (value, field, id) => {
        console.log(value)
        setData((prevData) =>
            prevData.map((item) => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    const handleAdd = () => {
        const newData = {
            id: data.length + 1,
            name: '',
            address: '',
            relationship: '',
            dob: '',
        };
        setData((prevData) => [...prevData, newData]);
    };

    const handleDelete = (id) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
    };

    const handleSave = (values) => {
        // Save the data to your backend or perform any desired action
        console.log(data);
        constructDocDefinition(values);
    };

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

    const constructDocDefinition = async (values, empDat) => {
        let employeeDetails = empDat;
        if (!empDat) {
            employeeDetails = await fetchEmployeeDetails(dispatch, params?.id);
        }
        console.log(employeeDetails, data, values);
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
                    widths: ["*", "*", "auto", "auto", "auto"],
                    body: [
                        [{ text: 'Name', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }, { text: "Nominee's Relationship\nwith member", style: 'tableHeader' }, { text: "Date of birth", style: 'tableHeader' }, { text: "Percentage", style: 'tableHeader' }],
                        ...data?.map((nomDet) => ([
                            {
                                text: nomDet?.nomineeName,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.nomineeAddress,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.nomineeRelation,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.nomineeDob?.split("T")?.[0],
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.percentage,
                                style: "tableCell",
                            },
                        ])),
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
                        ...employeeDetails?.familyDetails?.map((fDetail) => ([
                            {
                                text: fDetail?.name,
                                style: "tableCell",
                            },
                            {
                                text: fDetail?.placeOfResidence || "-",
                                style: "tableCell",
                            },
                            {
                                text: fDetail?.relationship,
                                style: "tableCell",
                            },
                            {
                                text: fDetail?.dob?.split("T")?.[0],
                                style: "tableCell",
                            },
                        ])),
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
                    `Date of joining E.P.F.: ${values?.dateOfJoiningEPF ?? "__ / __ / 19__"}\nPast Service: ${values?.pastService ?? "____"} year\nDate of joining EPS: ${values?.dateOfJoiningEPS ?? "__ / __ / 19__"}`,
                    [
                        "Entries Verified\n\n",
                        {
                            columns: [
                                "D.A.",
                                values?.entriesVerified?.includes("DA") ?
                                    {
                                        canvas: [
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: true,
                                                points: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 5 }, { x: 4, y: 6 }, { x: 6, y: 2 }]
                                            },
                                        ],
                                    } :
                                    {
                                        canvas: [
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: true,
                                                points: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 6 }, { x: 6, y: 2 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 2 }, { x: 6, y: 6 }]
                                            },
                                        ],
                                    }
                                ,
                                "S.S.",
                                values?.entriesVerified?.includes("SS") ?
                                    {
                                        canvas: [
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: true,
                                                points: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 5 }, { x: 4, y: 6 }, { x: 6, y: 2 }]
                                            },
                                        ],
                                    } :
                                    {
                                        canvas: [
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: true,
                                                points: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 6 }, { x: 6, y: 2 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 2 }, { x: 6, y: 6 }]
                                            },
                                        ],
                                    }
                                ,
                                "A.A.O.",
                                values?.entriesVerified?.includes("AAO") ?
                                    {
                                        canvas: [
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: true,
                                                points: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 5 }, { x: 4, y: 6 }, { x: 6, y: 2 }]
                                            },
                                        ],
                                    } :
                                    {
                                        canvas: [
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: true,
                                                points: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 6 }, { x: 6, y: 2 }]
                                            },
                                            {
                                                type: 'polyline',
                                                lineWidth: 1,
                                                closePath: false,
                                                points: [{ x: 2, y: 2 }, { x: 6, y: 6 }]
                                            },
                                        ],
                                    }
                                ,
                            ],
                        },
                    ]
                ]
                ,
                marginBottom: 20,
            },
            "I hereby nominate the following person for receiving the monthly Pension (admissible under para 16(2)(g)(i)&(ii) in the event of my death without leaving any eligible family for receiving pension.\n\n",
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "auto", "auto", "auto"],
                    body: [
                        [{ text: 'Name', style: 'tableHeader' }, { text: 'Address', style: 'tableHeader' }, { text: "Nominee's Relationship\nwith member", style: 'tableHeader' }, { text: "Date of birth", style: 'tableHeader' }, { text: 'Percentage', style: 'tableHeader' }],
                        ...data?.map((nomDet) => ([
                            {
                                text: nomDet?.name,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.address,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.relationship,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.dob,
                                style: "tableCell",
                            },
                            {
                                text: nomDet?.percentage,
                                style: "tableCell",
                            },
                        ])),
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

    const getData = async () => {
        const employeeDetails = await fetchEmployeeDetails(dispatch, params?.id);
        setData(employeeDetails?.nomineeDetails ?? [])
        constructDocDefinition({}, employeeDetails);
    }

    useEffect(() => {
        getData();
    }, [])


    return (
        <div className="h-100 w-100 py-3 provident-fund-container d-flex flex-row">
            <div className='w-40 h-100 pe-4 text-end'>
                <div>
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        bordered
                        size="middle"
                        scroll={{ y: 400 }}
                    />
                    <Button className='my-4' type="secondary" onClick={handleAdd} >
                        Add Row
                    </Button>
                </div>
                <Form onFinish={handleSave}>
                    <Form.Item name="dateOfJoiningEPF" label="Date of Joining E.P.F" rules={[{ required: true, message: 'Please select a date' }]}>
                        <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </Form.Item>
                    <Form.Item name="pastService" label="Past Service" rules={[{ required: true, message: 'Please enter past service' }]}>
                        <Input placeholder='Enter Year' />
                    </Form.Item>
                    <Form.Item name="dateOfJoiningEPS" label="Date of Joining E.P.S" rules={[{ required: true, message: 'Please select a date' }]}>
                        <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </Form.Item>
                    <Form.Item name="entriesVerified" label="Entries Verified">
                        <Checkbox.Group>
                            <Checkbox value="DA">D.A</Checkbox>
                            <Checkbox value="SS">S.S</Checkbox>
                            <Checkbox value="AAO">A.A.O</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>

            </div>
            <PdfPreview className="w-60 h-100" docDefinition={{ content: docDefinition, styles: styles }} key={1} />

        </div>
    )
}

export default ProvidentFundFormComponent;