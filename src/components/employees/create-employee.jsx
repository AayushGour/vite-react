import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../utility/secondary-header';
import Loader from '../utility/loader';
import { Badge, Button, Form } from 'react-bootstrap';
import StepsComponent from '../utility/steps-component';
import UploadComponent from '../utility/upload-component';
import { createEmployeeUrl, getClientsListUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { rolesList } from '../utility/constants';
import EditableTable from '../utility/family-editable-table';

const CreateUserComponent = (props) => {
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [loaderFlag, setLoaderFlag] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [name, setName] = useState('');
    const [guardian, setGuardian] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [dob, setDob] = useState('');
    const [designation, setDesignation] = useState('');
    const [qualification, setQualification] = useState('');
    const [experience, setExperience] = useState('');
    const [permanentAddress, setPermanentAddress] = useState('');
    const [presentAddress, setPresentAddress] = useState('');
    const [languages, setLanguages] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [idMarks, setIdMarks] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [sex, setSex] = useState('');
    const [nomineeName, setNomineeName] = useState('');
    const [nomineeRelation, setNomineeRelation] = useState('');
    const [nomineeDob, setNomineeDob] = useState('');
    const [nomineeAddress, setNomineeAddress] = useState('');
    const [oldEsiNumber, setOldEsiNumber] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [references, setReferences] = useState([
        { index: 1, name: "", occupation: "", address: "" },
        { index: 2, name: "", occupation: "", address: "" },
    ]);
    const [familyDetails, setFamilyDetails] = useState([]);
    const [filesList, setFilesList] = useState([]);
    const [clientsList, setClientsList] = useState([]);
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [uanNumber, setUanNumber] = useState("");
    const [clientId, setClientId] = useState(localStorage.getItem('clientId') || "");

    const role = localStorage.getItem('roles');

    // useEffect(() => {
    //     getClientsList()
    // }, [])
    // const getClientsList = () => {
    //     setLoaderFlag(true);
    //     const config = {
    //         method: "get",
    //         url: getClientsListUrl,
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         }
    //     }
    //     axios(config).then((resp) => {
    //         setClientsList(resp?.data?.data?.data)
    //     }).catch((e) => {
    //         console.error(e);
    //         toast.error(e?.response?.message);
    //     }).finally(() => {
    //         setLoaderFlag(false);
    //     })
    // }

    const handleReferenceChange = (index, key, value) => {
        const refObj = references?.map((e) => e?.index === index ? { ...e, [key]: value } : e);
        setReferences(refObj);
    }


    const handleFileSelect = (index, file) => {
        const updatedList = filesList?.filter((file) => file?.index !== index);
        setFilesList([...updatedList, { index: index, file: file }]);
    }

    const formSteps = [
        {
            index: 1,
            title: "Personal Information"
        },
        {
            index: 2,
            title: "References"
        },
        {
            index: 3,
            title: "Family Details"
        },
        {
            index: 4,
            title: "Biometric Information"
        }
    ]

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setLoaderFlag(true)
        setValidated(true);

        const formData = new FormData();
        filesList?.forEach((file) => {
            formData.append(file?.index <= 3 ? `leftThumb${file?.index}` : `rightThumb${file?.index - 3}`, file?.file)
        })
        formData.append("name", name)
        formData.append("guardian", guardian)
        formData.append("contactNumber", contactNumber)
        formData.append("dob", dob)
        formData.append("sex", sex)
        formData.append("designation", designation)
        formData.append("qualification", qualification)
        formData.append("experience", experience)
        formData.append("permanentAddress", permanentAddress)
        formData.append("presentAddress", presentAddress)
        formData.append("languages", languages)
        formData.append("aadharNumber", aadharNumber)
        formData.append("panNumber", panNumber)
        formData.append("idMarks", idMarks)
        formData.append("maritalStatus", maritalStatus)
        formData.append("appointmentDate", appointmentDate)
        formData.append("accountNumber", accountNumber)
        formData.append("ifscCode", ifscCode)
        formData.append("uanNumber", uanNumber)
        formData.append("agencyId", localStorage.getItem('agencyId'))
        formData.append("nomineeDetails", JSON.stringify({
            nomineeName,
            nomineeRelation,
            nomineeDob,
            nomineeAddress,
            percentage: 100
        }));
        formData.append("nomineeDetails", JSON.stringify({}));

        // formData.append("clientId", clientId)
        if (familyDetails?.length === 1) {
            formData?.append('familyDetails', JSON.stringify({}));
        }
        familyDetails?.map((fam) => {
            formData.append("familyDetails", JSON.stringify(fam))
        })

        references?.forEach((ref) => {
            formData.append('references', JSON.stringify(ref))
        })


        const config = {
            method: "post",
            url: createEmployeeUrl,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        }

        axios(config).then((resp) => {
            toast.success(resp?.data?.data?.message);
            navigate("/manage-employees");
        }).catch((e) => {
            console.error(e);
            toast.error("Something went wrong")
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

    return (
        <div className="create-user-container h-100 w-100 px-5 py-4">
            <SecondaryHeader title="Onboard Employee" />
            <StepsComponent currentStep={currentStep} steps={formSteps} className="mt-3 mx-3" />
            {/* {(role === rolesList.ADMIN || role === rolesList.SUPERADMIN) && currentStep === 1 ?
                <div className='w-100 text-start mx-3 mt-4 mb-3'>
                    <h4 className='text-start w-100'>Select Client</h4>
                    <label className='mt-2'>Client</label>
                    <Form.Select
                        className='w-32'
                        value={clientId}
                        onChange={(event) => setClientId(event.target.value)}
                    >
                        <option value="">Choose...</option>
                        {clientsList?.map((client, index) => {
                            return <option key={index} value={client?._id}>{client?.clientName}</option>
                        })}
                    </Form.Select>
                </div>
                : <></>
            } */}
            <Form className='mt-4 d-flex flex-row flex-wrap gap-3 pb-4 gap-3 px-3' noValidate validated={validated} onSubmit={handleSubmit}>
                {currentStep === 1 ?

                    <>
                        <h4 className='text-start w-100'>Personal Information</h4>
                        <Form.Group className='text-start w-32' controlId="employeeName">
                            <Form.Label>Name <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="guardianName">
                            <Form.Label>Father's / Husband's Name <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={guardian}
                                onChange={(e) => setGuardian(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide Father's or Husband's name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="contactNumber">
                            <Form.Label>Contact Number <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                minLength={10}
                                maxLength={10}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Contact number.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="dobCalendar">
                            <Form.Label>Date of Birth <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide your date of birth.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="designationSelect">
                            <Form.Label>Select Designation <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="select"
                                value={designation}
                                onChange={(e) => setDesignation(e?.target?.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="SECURITY SUPERVISOR">Security Supervisor</option>
                                <option value="HEAD GUARD">Head Guard</option>
                                <option value="SECURITY GUARD">Security Guard</option>
                                <option value="LADY GUARD">Lady Guard</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="qualification">
                            <Form.Label>Qualification <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide your qualification.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="experience">
                            <Form.Label>Experience <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide your experience.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="idMarks">
                            <Form.Label>Identification Marks <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={idMarks}
                                onChange={(e) => setIdMarks(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide identification marks.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="permanentAddress">
                            <Form.Label>Permanent Address <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={permanentAddress}
                                onChange={(e) => setPermanentAddress(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide your permanent address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="presentAddress">
                            <Form.Label>Present Address <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={presentAddress}
                                onChange={(e) => setPresentAddress(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide your present address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="languagesKnown">
                            <Form.Label>Languages Known <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={languages}
                                onChange={(e) => setLanguages(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide languages known.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="aadhaarnumber">
                            <Form.Label>Aadhar Number <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={aadharNumber}
                                onChange={(e) => setAadharNumber(e.target.value)}
                                required
                                pattern='\d{12}'
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide aadhar number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="panNumber">
                            <Form.Label>PAN Number <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={panNumber}
                                onChange={(e) => setPanNumber(e.target.value)}
                                required
                                pattern='[A-Z]{5}[0-9]{4}[A-Z]{1}'
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide PAN number.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-49' controlId="maritalStatus">
                            <Form.Label>Sex <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="select"
                                value={sex}
                                onChange={(e) => setSex(e?.target?.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="maritalStatus">
                            <Form.Label>Marital Status <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="select"
                                value={maritalStatus}
                                onChange={(e) => setMaritalStatus(e?.target?.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                                <option value="Engaged">Engaged</option>
                                <option value="In a domestic partnership">In a domestic partnership</option>
                                <option value="Civil union">Civil union</option>
                                <option value="Annulled">Annulled</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="nomineeName">
                            <Form.Label>Old ESI Number (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                value={oldEsiNumber}
                                onChange={(e) => setOldEsiNumber(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="nomineeName">
                            <Form.Label>Date of Appointment <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide date of birth of nominee.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <h4 className='text-start w-100'>Nominee Details</h4>
                        <Form.Group className='text-start w-32' controlId="nomineeName">
                            <Form.Label>Nominee <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={nomineeName}
                                onChange={(e) => setNomineeName(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a nominee.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="nomineeRelation">
                            <Form.Label>Relationship with nominee <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={nomineeRelation}
                                onChange={(e) => setNomineeRelation(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a nominee relation.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="dobCalendar">
                            <Form.Label>Date of Birth of Nominee <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={nomineeDob}
                                onChange={(e) => setNomineeDob(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide date of birth of nominee.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="nomineeAddress">
                            <Form.Label>Nominee Address <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={nomineeAddress}
                                onChange={(e) => setNomineeAddress(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a nominee address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <h4 className='text-start w-100'>Bank Details</h4>
                        <Form.Group className='text-start w-32' controlId="accountNumber">
                            <Form.Label>Account Number <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Account Number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="ifscCode">
                            <Form.Label>IFSC Code <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value)}
                                required
                                pattern='[A-Z]{4}[0][A-Z0-9]{6}'
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a IFSC Code.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="accountNumber">
                            <Form.Label>UAN Number <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={uanNumber}
                                onChange={(e) => setUanNumber(e.target.value)}
                                required
                                pattern="[A-Z]{2}/\d{5}/\d{7}"
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a UAN Number.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="w-100 mt-3 text-end">
                            <Button type='primary'
                                disabled={
                                    name === "" ||
                                    guardian === "" ||
                                    contactNumber === "" ||
                                    dob === "" ||
                                    designation === "" ||
                                    qualification === "" ||
                                    experience === "" ||
                                    idMarks === "" ||
                                    sex === "" ||
                                    permanentAddress === "" ||
                                    presentAddress === "" ||
                                    languages === "" ||
                                    aadharNumber === "" ||
                                    maritalStatus === "" ||
                                    nomineeName === "" ||
                                    nomineeRelation === "" ||
                                    nomineeDob === "" ||
                                    nomineeAddress === "" ||
                                    appointmentDate === "" ||
                                    accountNumber === "" ||
                                    ifscCode === "" ||
                                    uanNumber === ""
                                }
                                onClick={() => setCurrentStep(2)}>Next</Button>
                        </div>

                    </>
                    : currentStep === 2 ? <>
                        <h4 className='text-start w-100'>References</h4>
                        <span className='text-start w-100'>Please provide the details of 2 of your neighbours as references.</span>
                        <h6 className='text-start w-100'>Reference 1</h6>
                        <Form.Group className='text-start w-32' controlId="refName1">
                            <Form.Label>Reference Name <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={references?.find((e) => e?.index === 1).name}
                                onChange={(e) => handleReferenceChange(1, 'name', e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a reference.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="refocc1">
                            <Form.Label>Occupation <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={references?.find((e) => e?.index === 1).occupation}
                                onChange={(e) => handleReferenceChange(1, 'occupation', e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide an occupation.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-65 me-5' controlId="refAdd1">
                            <Form.Label>Reference Address <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={references?.find((e) => e?.index === 1).address}
                                onChange={(e) => handleReferenceChange(1, 'address', e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide an address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <h6 className='text-start w-100'>Reference 2</h6>
                        <Form.Group className='text-start w-32' controlId="refName2">
                            <Form.Label>Reference Name <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={references?.find((e) => e?.index === 2).name}
                                onChange={(e) => handleReferenceChange(2, 'name', e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a reference.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-32' controlId="refocc2">
                            <Form.Label>Occupation <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={references?.find((e) => e?.index === 2).occupation}
                                onChange={(e) => handleReferenceChange(2, 'occupation', e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide an occupation.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-65' controlId="refAdd2">
                            <Form.Label>Reference Address <span className='color-red'>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                value={references?.find((e) => e?.index === 2).address}
                                onChange={(e) => handleReferenceChange(2, 'address', e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a reference.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="w-100 mt-3 text-end">
                            <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                                Back
                            </Button>
                            <Button
                                disabled={!references?.every((e) => Object.values(e)?.every((v) => !!v))}
                                variant='primary'
                                className='ms-2'
                                onClick={() => setCurrentStep(3)}>Next</Button>
                        </div>
                    </>
                        : currentStep === 3 ?
                            <>
                                <h4 className='text-start w-100'>Family Information</h4>
                                <span className='text-start w-100'>Please enter the following details about your family.</span>
                                <EditableTable initialData={familyDetails} onChange={(e) => setFamilyDetails(e)} isEdit={true} />
                                <div className="w-100 mt-3 text-end">
                                    <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                                        Back
                                    </Button>
                                    <Button
                                        disabled={!references?.every((e) => Object.values(e)?.every((v) => !!v))}
                                        variant='primary'
                                        className='ms-2'
                                        onClick={() => setCurrentStep(4)}>Next</Button>
                                </div>
                            </>
                            :
                            <>
                                <h4 className='text-start w-100'>Biometric Information</h4>
                                <span className='text-start w-100'>Please upload images of your thumb impressions.</span>

                                <h6 className='text-start w-100'>Left Hand Thumb Impressions</h6>
                                <UploadComponent className="w-32" file={filesList?.find((f) => f?.index === 1)?.file} index={1} handleFileSelect={handleFileSelect} />
                                <UploadComponent className="w-32" file={filesList?.find((f) => f?.index === 2)?.file} index={2} handleFileSelect={handleFileSelect} />
                                <UploadComponent className="w-32" file={filesList?.find((f) => f?.index === 3)?.file} index={3} handleFileSelect={handleFileSelect} />
                                <h6 className='text-start w-100'>Right Hand Thumb Impressions</h6>
                                <UploadComponent className="w-32" file={filesList?.find((f) => f?.index === 4)?.file} index={4} handleFileSelect={handleFileSelect} />
                                <UploadComponent className="w-32" file={filesList?.find((f) => f?.index === 5)?.file} index={5} handleFileSelect={handleFileSelect} />
                                <UploadComponent className="w-32" file={filesList?.find((f) => f?.index === 6)?.file} index={6} handleFileSelect={handleFileSelect} />
                                <div className="w-100 mt-3 text-end">
                                    <Button variant="secondary" onClick={() => setCurrentStep(3)}>
                                        Back
                                    </Button>
                                    <Button
                                        disabled={filesList?.length !== 6}
                                        // disabled={
                                        //     contactPerson === "" ||
                                        //     contactEmail === "" ||
                                        //     contactNumber === "" ||
                                        //     password === ""
                                        // }
                                        variant="primary" className='ms-2' type="submit">
                                        Submit
                                    </Button>
                                </div>

                            </>}
            </Form>
            {loaderFlag ? <Loader className="overlay" /> : <></>}
        </div >
    )
}

export default CreateUserComponent;