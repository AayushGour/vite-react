import React, { useState } from 'react';
import { useEffect } from 'react';
import { convertImageToBase64 } from '../utility/file-convertors';
import PdfPreview from '../utility/pdf-preview';
import ECLogo from "../../assets/img/ec-logo.png";
import { fetchEmployeeDetails } from '../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, DatePicker, Form, Input } from 'antd';
import "./appointment-letter.scss";
import SecondaryHeader from '../utility/secondary-header';

const AppointmentLetterComponent = (props) => {
    const [docDefinition, setDocDefinition] = useState([]);
    const initialValues = {
        date: new Date().toISOString()?.split("T")[0],
        department: "SECURITY",
    }
    const params = useParams();
    // const employeeDetails = useSelector((state) => state?.appReducer?.employeeDetails);
    const dispatch = useDispatch();
    const { Item } = Form;

    const styles = {
        regular: {
            fontSize: 12,
            font: "Helvetica"
        },
        pageTitle: {
            fontSize: 18,
            bold: true,
            font: "Times-New-Roman"
        },
        header: {
            fontSize: 18,
            bold: true
        },
        subheader: {
            fontSize: 15,
            bold: true
        },
    }

    const constructDocDefinition = async (values) => {
        const employeeDetails = await fetchEmployeeDetails(dispatch, params?.id);
        console.log(employeeDetails);
        const base64Img = await convertImageToBase64(ECLogo)
        const docDef = [
            {
                columns: [
                    {
                        image: base64Img,
                        width: 150,
                    },
                    {
                        text: ["EFFECTIVE COMPLY\n", {
                            text: "Plot No - 123, Hyderabad, Telangana",
                            fontSize: 12,
                            bold: false,
                        }],
                        style: "pageTitle",
                        marginLeft: 20
                    }
                ]
            },
            {
                marginTop: 20,
                marginBottom: 20,
                columns: [
                    {
                        text: [
                            `Employee Name: ${employeeDetails?.name}\n\n`,
                            `Token Number: ${employeeDetails?.employeeId}\n\n`,
                            `Department: ${values?.department ?? "SECURITY"}\n\n`,
                            `Designation: ${employeeDetails?.designation}\n\n`,
                        ],
                        style: "regular"
                    },
                    {
                        text: [
                            `Date: ${values?.date ?? new Date()?.toISOString()?.split("T")[0]}\n\n`,
                            `Address: ${employeeDetails?.presentAddress}\n`,
                        ],
                        style: "regular"
                    },
                ]
            },
            `Dear ${employeeDetails?.sex === "male" ? "Sir" : "Madam"},\n\n`,
            {
                text: 'Sub: APPOINTMENT LETTER',
                style: 'subheader',
                alignment: "center",
                marginBottom: 15,
            },
            {
                ol: [
                    {
                        text: [
                            `With reference to your application for employment and the subsequent interviews you had with us, we are pleased to offer you an appointment as ${employeeDetails?.designation?.toUpperCase()} w.e.f. ${employeeDetails?.appointmentDate?.split("T")[0] ?? "__-__-____"} in our organization on the following terms and conditions: -\n\nYou will be paid a gross salary of Rs. ${employeeDetails?.salaryDetails?.salary ?? "______"} /- Only (Rupees as per statutory post and grade) per month.\n\n`,
                            {
                                text: `ಉದ್ಯೋಗಕ್ಕಾಗಿ ನಿಮ್ಮ ಅರ್ಜಿ ಮತ್ತು ನೀವು ನಮ್ಮೊಂದಿಗೆ ನಡೆಸಿದ ನಂತರದ ಸಂದರ್ಶನಗಳನ್ನು ಉಲ್ಲೇಖಿಸಿ, ಈ ಕೆಳಗಿನ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳ ಮೇಲೆ ನಮ್ಮ ಸಂಸ್ಥೆಯಲ್ಲಿ ${employeeDetails?.appointmentDate?.split("T")[0] ?? "__-__-____"} ರಂದು ${employeeDetails?.designation?.toUpperCase()} ಯಾಗಿ ನಿಮಗೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನೀಡಲು ನಾವು ಸಂತೋಷಪಡುತ್ತೇವೆ: -\n\nನಿಮಗೆ ತಿಂಗಳಿಗೆ ರೂ. ${employeeDetails?.salaryDetails?.salary ?? "______"} /- ಮಾತ್ರ (ಕಾನೂನುಬದ್ಧ ಹುದ್ದೆ ಮತ್ತು ದರ್ಜೆಯ ಪ್ರಕಾರ ರೂಪಾಯಿಗಳು) ಒಟ್ಟು ವೇತನವನ್ನು ನೀಡಲಾಗುವುದು.\n\n`,
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            },
                        ],
                    },
                    {
                        text: ['You will be on probation for a period of six months from the date of your report to duty Your probationary period  may be extended for a further period of six months at the sole discretion of the Management, and the same will  be communicated to you in writing. On satisfactory completion of your probationary period and/or any extended  period thereafter you may be confirmed in writing by the Management. At the end of the period of probation and/or any extended period thereafter, if no written confirmation is received by us, you will be deemed to  have been confirmed.\n\n',
                            {
                                text: "ವರದಿಯ ದಿನಾಂಕದಿಂದ ಕರ್ತವ್ಯಕ್ಕೆ ಆರು ತಿಂಗಳ ಅವಧಿಗೆ ನೀವು ಪರೀಕ್ಷೆಯಲ್ಲಿರುತ್ತಾರೆ ನಿಮ್ಮ ಪ್ರೊಬೇಷನರಿ ಅವಧಿಯನ್ನು ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್‌ನ ಸ್ವಂತ ವಿವೇಚನೆಯಿಂದ ಇನ್ನೂ ಆರು ತಿಂಗಳವರೆಗೆ ವಿಸ್ತರಿಸಬಹುದು ಮತ್ತು ಅದನ್ನು ನಿಮಗೆ ತಿಳಿಸಲಾಗುತ್ತದೆ ಬರವಣಿಗೆಯಲ್ಲಿ ನಿಮ್ಮ ಪ್ರೊಬೇಷನರಿ ಅವಧಿ ಮತ್ತು/ಅಥವಾ ಅದರ ನಂತರ ಯಾವುದೇ ವಿಸ್ತೃತ  ಅವಧಿಯನ್ನು ತೃಪ್ತಿಕರವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ ನಂತರ ನೀವು ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ಮೂಲಕ ಲಿಖಿತವಾಗಿ ದೃಢೀಕರಿಸಬಹುದು. ಪರೀಕ್ಷೆಯ ಅವಧಿಯ ಕೊನೆಯಲ್ಲಿ ಮತ್ತು / ಅಥವಾ ಅದರ ನಂತರ ಯಾವುದೇ ವಿಸ್ತೃತ ಅವಧಿಯ ನಂತರ, ಯಾವುದೇ ಲಿಖಿತ ದೃಢೀಕರಣವನ್ನು ನಮ್ಮಿಂದ ಸ್ವೀಕರಿಸದಿದ್ದರೆ, ನಿಮ್ಮನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['You will also be eligible for PF, ESI, Gratuity, Leave and other benefits as per rules and as applicable to all other employees in your cadre.\n\n',
                            {
                                text: "ನಿಯಮಗಳ ಪ್ರಕಾರ ಮತ್ತು ನಿಮ್ಮ ಕೇಡರ್‌ನಲ್ಲಿರುವ ಇತರ ಎಲ್ಲ ಉದ್ಯೋಗಿಗಳಿಗೆ ಅನ್ವಯವಾಗುವಂತೆ ನೀವು PF, ESI, ಗ್ರಾಚ್ಯುಟಿ, ರಜೆ ಮತ್ತು ಇತರ ಪ್ರಯೋಜನಗಳಿಗೆ ಅರ್ಹರಾಗುತ್ತೀರಿ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['During the period of your employment, you shall agree to work in shifts. You shall accept to work at any security  post within the same factory or to any other clients of the Company and the rules and regulations applicable to the new place of posting shall be applicable to you.\n\n',
                            {
                                text: "ನಿಮ್ಮ ಉದ್ಯೋಗದ ಅವಧಿಯಲ್ಲಿ, ನೀವು ಪಾಳಿಯಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಒಪ್ಪುತ್ತೀರಿ. ಅದೇ ಕಾರ್ಖಾನೆಯೊಳಗಿನ ಯಾವುದೇ   ಭದ್ರತಾ ಪೋಸ್ಟ್‌ನಲ್ಲಿ ಅಥವಾ ಕಂಪನಿಯ ಯಾವುದೇ ಇತರ ಕ್ಲೈಂಟ್‌ಗಳಿಗೆ ಕೆಲಸ ಮಾಡಲು ನೀವು ಒಪ್ಪಿಕೊಳ್ಳಬೇಕು ಮತ್ತು ಹೊಸ ಪೋಸ್ಟ್ ಮಾಡುವ ಸ್ಥಳಕ್ಕೆ ಅನ್ವಯವಾಗುವ ನಿಯಮಗಳು ಮತ್ತು ನಿಬಂಧನೆಗಳು ನಿಮಗೆ ಅನ್ವಯಿಸುತ್ತವೆ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['During the period of service with the company, you shall not carry on any business of your own either part time or otherwise.\n\n',
                            {
                                text: "ಕಂಪನಿಯೊಂದಿಗಿನ ಸೇವೆಯ ಅವಧಿಯಲ್ಲಿ, ನೀವು ನಿಮ್ಮ ಸ್ವಂತ ವ್ಯವಹಾರವನ್ನು ಅರೆಕಾಲಿಕ ಅಥವಾ ಬೇರೆ ರೀತಿಯಲ್ಲಿ ನಡೆಸಬಾರದು\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['You shall not at any time, disclose to anyone any information, know-how knowledge secret methods, plans, etc. of  the company.\n\n',
                            {
                                text: "ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ, ಕಂಪನಿಯ ಯಾವುದೇ ಮಾಹಿತಿ, ಜ್ಞಾನದ ರಹಸ್ಯ ವಿಧಾನಗಳು, ಯೋಜನೆಗಳು ಇತ್ಯಾದಿಗಳನ್ನು ಯಾರಿಗೂ ಬಹಿರಂಗಪಡಿಸಬಾರದು.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['You will be responsible for the work, machinery, tools and other items, materials entrusted to you from time to time.\n\n',
                            {
                                text: "ಕಾಲಕಾಲಕ್ಕೆ ನಿಮಗೆ ಒಪ್ಪಿಸಲಾದ ಕೆಲಸ, ಯಂತ್ರೋಪಕರಣಗಳು, ಉಪಕರಣಗಳು ಮತ್ತು ಇತರ ವಸ್ತುಗಳು, ಸಾಮಗ್ರಿಗಳಿಗೆ ನೀವು ಜವಾಬ್ದಾರರಾಗಿರುತ್ತೀರಿ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['This offer of appointment is purely based on the information furnished by you and should there be any material information not being disclose or if found at later stage that the information furnished by you is false, you will be subject to strict disciplinary action including termination of employment without any notice or compensation.\n\n',
                            {
                                text: "ನೇಮಕಾತಿಯ ಈ ಪ್ರಸ್ತಾಪವು ಸಂಪೂರ್ಣವಾಗಿ ನೀವು ಒದಗಿಸಿದ ಮಾಹಿತಿಯ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ ಮತ್ತು ಯಾವುದೇ ವಸ್ತು ಮಾಹಿತಿಯನ್ನು ಬಹಿರಂಗಪಡಿಸದಿದ್ದಲ್ಲಿ ಅಥವಾ ನೀವು ಒದಗಿಸಿದ ಮಾಹಿತಿಯು ಸುಳ್ಳು ಎಂದು ನಂತರದ  ಹಂತದಲ್ಲಿ ಕಂಡುಬಂದರೆ, ನೀವು ಮುಕ್ತಾಯ ಸೇರಿದಂತೆ ಕಠಿಣ ಶಿಸ್ತಿನ ಕ್ರಮಕ್ಕೆ ಒಳಪಟ್ಟಿರುತ್ತೀರಿ ಯಾವುದೇ ಸೂಚನೆ ಅಥವಾ ಪರಿಹಾರವಿಲ್ಲದೆ ಉದ್ಯೋಗ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['In addition to the above conditions, you will be governed by the Certified Standing Orders of the company applicable to workers and to such other rules and regulations that may be framed from time to time.\n\n',
                            {
                                text: "ಮೇಲಿನ ಷರತ್ತುಗಳಿಗೆ ಹೆಚ್ಚುವರಿಯಾಗಿ, ಕಾರ್ಮಿಕರಿಗೆ ಅನ್ವಯವಾಗುವ ಕಂಪನಿಯ ಪ್ರಮಾಣೀಕೃತ ಸ್ಥಾಯಿ ಆದೇಶಗಳು ಮತ್ತು ಕಾಲಕಾಲಕ್ಕೆ ರೂಪಿಸಬಹುದಾದ ಇತರ ನಿಯಮಗಳು ಮತ್ತು ನಿಬಂಧನೆಗಳಿಂದ ನಿಮ್ಮನ್ನು ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['Your residential address as stated above is furnished by you and is deemed as the address for any specific communication or notice to you. You should keep the Management informed of any change in your address.\n\n',
                            {
                                text: "ಮೇಲೆ ತಿಳಿಸಿದಂತೆ ನಿಮ್ಮ ವಸತಿ ವಿಳಾಸವನ್ನು ನೀವು ಒದಗಿಸಿರುವಿರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಸಂವಹನ  ಅಥವಾ ಸೂಚನೆಗಾಗಿ ವಿಳಾಸವೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ವಿಳಾಸದಲ್ಲಿನ ಯಾವುದೇ ಬದಲಾವಣೆಯ ಕುರಿತು ನೀವು ನಿರ್ವಹಣೆಗೆ ತಿಳಿಸಬೇಕು.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['If you wish to resign the job, you have to intimate to respective superior well in advance.\n\n',
                            {
                                text: "ನೀವು ಕೆಲಸಕ್ಕೆ ರಾಜೀನಾಮೆ ನೀಡಲು ಬಯಸಿದರೆ, ನೀವು ಆಯಾ ಮೇಲಧಿಕಾರಿಗಳಿಗೆ ಮುಂಚಿತವಾಗಿಯೇ ತಿಳಿಸಬೇಕು.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                    {
                        text: ['You shall retire from the services of the Company on attaining the age of 58 years.\n\n',
                            {
                                text: "ನೀವು 58 ವರ್ಷ ವಯಸ್ಸಾದ ಮೇಲೆ ಕಂಪನಿಯ ಸೇವೆಗಳಿಂದ ನಿವೃತ್ತರಾಗುತ್ತೀರಿ.\n\n",
                                font: "Kannada-font",
                                lineHeight: 1.2,
                            }
                        ]
                    },
                ],
                style: "regular"
            },
            {
                text: 'Please sign the duplicate of this letter in token of your acceptance of the same.\n\n',
                // pageBreak: "before"
            },
            {
                text: "ದಯವಿಟ್ಟು ಈ ಪತ್ರದ ನಕಲು ಪತ್ರವನ್ನು ನೀವು ಸ್ವೀಕರಿಸಿದ ಟೋಕನ್‌ನಲ್ಲಿ ಸಹಿ ಮಾಡಿ.\n\n\n",
                font: "Kannada-font",
                lineHeight: 1.2,
            },
            { text: "For M/s EFFECTIVE COMPLY PVT LTD\n\n\n\n\nAuthorized Signatory\n\n\n\n", font: "Times-New-Roman", bold: true },
            'The above terms and conditions of employment has been read over and explained to me in Kannada, and I voluntarily and willingly accept all the above terms & conditions.\n\n',
            {
                text: "ಮೇಲಿನ ಉದ್ಯೋಗದ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಓದಲಾಗಿದೆ ಮತ್ತು ವಿವರಿಸಲಾಗಿದೆ. ಮತ್ತು ನಾನು ಸ್ವಯಂಪ್ರೇರಣೆಯಿಂದ ಮತ್ತು ಸ್ವಇಚ್ಛೆಯಿಂದ ಮೇಲಿನ ಎಲ್ಲಾ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೇನೆ.\n\n\n",
                font: "Kannada-font",
                lineHeight: 1.2,
            },

            `Place: ${values?.place ?? ""}\n\n`,
            {
                columns: [
                    `Date: ${values?.date ?? new Date().toISOString().split("T")[0]}`,
                    { text: "Signature of Employee", alignment: "right" }
                ]
            }
        ];
        setDocDefinition(docDef);
    }

    useEffect(() => {
        constructDocDefinition();
    }, [])

    const onFinish = (values) => {
        constructDocDefinition(values);
    };

    return (
        <div className="h-100 w-100 appointment-letter-container py-3">
            <div className="d-flex flex-row h-90">
                <div className="w-40 h-100 pe-5">
                    <Form onFinish={onFinish} initialValues={initialValues}>
                        <Item
                            name="date"
                            label="Date"
                            rules={[{ required: true, message: 'Please select a date' }]}
                        >
                            <Input type='date' />
                        </Item>
                        {/* <Item
                            name="salary"
                            label="Salary"
                            rules={[{ required: true, message: 'Please enter your salary' }]}
                        >
                            <Input type='number' />
                        </Item> */}
                        <Item
                            name="department"
                            label="Department"
                            rules={[{ required: true, message: 'Please enter your department' }]}
                        >
                            <Input />
                        </Item>
                        <Item
                            name="place"
                            label="Place"
                        // rules={[{ required: true, message: 'Please enter a place' }]}
                        >
                            <Input />
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Item>
                    </Form>
                </div>
                <PdfPreview className="w-60 h-100" docDefinition={{ content: docDefinition, styles: styles }} key={1} />

            </div>
        </div>
    )
}

export default AppointmentLetterComponent;