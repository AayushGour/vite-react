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
    const [idMarks, setIdMarks] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [nomineeName, setNomineeName] = useState('');
    const [nomineeRelation, setNomineeRelation] = useState('');
    const [references, setReferences] = useState([
        { index: 1, name: "", occupation: "", address: "" },
        { index: 2, name: "", occupation: "", address: "" },
    ])
    const [filesList, setFilesList] = useState([]);
    const [clientsList, setClientsList] = useState([]);
    const [clientId, setClientId] = useState(localStorage.getItem('clientId') || "");

    const role = localStorage.getItem('roles');

    useEffect(() => {
        getClientsList()
    }, [])
    const getClientsList = () => {
        setLoaderFlag(true);
        const config = {
            method: "get",
            url: getClientsListUrl,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }
        axios(config).then((resp) => {
            setClientsList(resp?.data?.data?.data)
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.message);
        }).finally(() => {
            setLoaderFlag(false);
        })
    }

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
        formData.append("designation", designation)
        formData.append("qualification", qualification)
        formData.append("experience", experience)
        formData.append("permanentAddress", permanentAddress)
        formData.append("presentAddress", presentAddress)
        formData.append("languages", languages)
        formData.append("aadharNumber", aadharNumber)
        formData.append("idMarks", idMarks)
        formData.append("maritalStatus", maritalStatus)
        formData.append("nomineeName", nomineeName)
        formData.append("nomineeRelation", nomineeRelation)
        formData.append("clientId", clientId)

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
        })

        setTimeout(() => {
            setLoaderFlag(false);
        }, 5000);
    }

    return (
        <div className="create-user-container h-100 w-100 p-4">
            <SecondaryHeader goBack title="Add Employee" />
            <StepsComponent currentStep={currentStep} steps={formSteps} className="mt-3 mx-3" />
            {(role === rolesList.ADMIN || role === rolesList.SUPERADMIN) && currentStep === 1 ?
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
            }
            <Form className='mt-4 d-flex flex-row flex-wrap gap-3 pb-4 gap-3 px-3' noValidate validated={validated} onSubmit={handleSubmit}>
                {currentStep === 1 ?

                    <>
                        <h4 className='text-start w-100'>Personal Information</h4>
                        <Form.Group className='text-start w-32' controlId="employeeName">
                            <Form.Label>Name</Form.Label>
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
                            <Form.Label>Father's / Husband's Name</Form.Label>
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
                            <Form.Label>Contact Number</Form.Label>
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
                            <Form.Label>Date of Birth</Form.Label>
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
                            <Form.Label>Select Designation</Form.Label>
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
                            <Form.Label>Qualification</Form.Label>
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
                            <Form.Label>Experience</Form.Label>
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
                            <Form.Label>Identification Marks</Form.Label>
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
                            <Form.Label>Permanent Address</Form.Label>
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
                            <Form.Label>Present Address</Form.Label>
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
                            <Form.Label>Languages Known</Form.Label>
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
                            <Form.Label>Aadhar Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={aadharNumber}
                                onChange={(e) => setAadharNumber(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide aadhar number.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="maritalStatus">
                            <Form.Label>Marital Status</Form.Label>
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
                            <Form.Label>Nominee</Form.Label>
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
                        <Form.Group className='text-start w-49' controlId="nomineeRelation">
                            <Form.Label>Relationship with nominee</Form.Label>
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
                                    permanentAddress === "" ||
                                    presentAddress === "" ||
                                    languages === "" ||
                                    aadharNumber === "" ||
                                    maritalStatus === "" ||
                                    nomineeName === "" ||
                                    nomineeRelation === ""
                                }
                                onClick={() => setCurrentStep(2)}>Next</Button>
                        </div>

                    </>
                    : currentStep === 2 ? <>
                        <h4 className='text-start w-100'>References</h4>
                        <span className='text-start w-100'>Please provide the details of 2 of your neighbours as references.</span>
                        <h6 className='text-start w-100'>Reference 1</h6>
                        <Form.Group className='text-start w-32' controlId="refName1">
                            <Form.Label>Reference Name</Form.Label>
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
                            <Form.Label>Occupation</Form.Label>
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
                            <Form.Label>Reference Address</Form.Label>
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
                            <Form.Label>Reference Name</Form.Label>
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
                            <Form.Label>Occupation</Form.Label>
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
                            <Form.Label>Reference Address</Form.Label>
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
                                // disabled={!references?.every((e) => Object.values(e)?.every((v) => !!v))}
                                variant='primary'
                                className='ms-2'
                                onClick={() => setCurrentStep(3)}>Next</Button>
                        </div>
                    </>
                        :
                        <>
                            <h4 className='text-start w-100'>Biometric Information</h4>
                            <span className='text-start w-100'>Please upload images of your thumb impressions.</span>

                            <h6 className='text-start w-100'>Left Hand Thumb Impressions</h6>
                            <UploadComponent className="w-32" index={1} handleFileSelect={handleFileSelect} />
                            <UploadComponent className="w-32" index={2} handleFileSelect={handleFileSelect} />
                            <UploadComponent className="w-32" index={3} handleFileSelect={handleFileSelect} />
                            <h6 className='text-start w-100'>Right Hand Thumb Impressions</h6>
                            <UploadComponent className="w-32" index={4} handleFileSelect={handleFileSelect} />
                            <UploadComponent className="w-32" index={5} handleFileSelect={handleFileSelect} />
                            <UploadComponent className="w-32" index={6} handleFileSelect={handleFileSelect} />
                            <div className="w-100 mt-3 text-end">
                                <Button variant="secondary" onClick={() => setCurrentStep(2)}>
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