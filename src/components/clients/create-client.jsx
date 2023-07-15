import React, { useState } from 'react';
import StepsComponent from '../utility/steps-component';
import { Button, Form } from 'react-bootstrap';
import SecondaryHeader from '../utility/secondary-header';
import Loader from '../utility/loader';
import { createClientUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateClientComponent = (props) => {
    const [clientName, setClientName] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [gstin, setGstin] = useState('');
    const [password, setPassword] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [loaderFlag, setLoaderFlag] = useState(false);

    const formSteps = [
        {
            index: 1,
            title: "Client Details"
        },
        {
            index: 2,
            title: "Representative Details"
        },
    ]

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        setLoaderFlag(true)
        setValidated(true);
        // Perform form submission logic here

        const config = {
            method: "post",
            url: createClientUrl,
            data: {
                clientName,
                billingAddress,
                street,
                city,
                state,
                postalCode,
                country,
                panNumber,
                gstin,
                contactPerson,
                contactEmail,
                contactNumber,
                password,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        axios(config).then((resp) => {
            toast.success(resp?.data?.data?.message);
        }).catch((e) => {
            console.error(e);
            toast.error(e?.response?.data?.message);
        }).finally(() => {
            setLoaderFlag(false)
        })
    };
    return (
        <div className="create-client-container px-5 mx-5 pt-4 h-100 w-auto position-relative">
            <SecondaryHeader title="Create Client" />
            <StepsComponent currentStep={currentStep} steps={formSteps} className="mt-3 mx-3" />
            <Form className='mt-4 d-flex flex-row flex-wrap gap-3 pb-4' noValidate validated={validated} onSubmit={handleSubmit}>
                {currentStep === 1 ?

                    <>
                        <h4 className='text-start w-100'>Client Details</h4>
                        <Form.Group className='text-start w-25' controlId="clientName">
                            <Form.Label>Client Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a client name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-100 mt-3' controlId="billingAddress">
                            <Form.Label>Billing Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={billingAddress}
                                onChange={(e) => setBillingAddress(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a billing address.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="street">
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                                type="text"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a street address.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a city.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="state">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a state.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="postalCode">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="number"
                                maxLength={6}
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a postal code.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='text-start w-32' controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a country.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <h4 className="text-start w-100 mt-3">Other Details</h4>
                        <Form.Group className='text-start w-49' controlId="panNumber">
                            <Form.Label>PAN Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={panNumber}
                                onChange={(e) => setPanNumber(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a PAN number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="gstin">
                            <Form.Label>GSTIN</Form.Label>
                            <Form.Control
                                type="text"
                                value={gstin}
                                onChange={(e) => setGstin(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a GSTIN.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="w-100 mt-3 text-end">
                            <Button
                                disabled={
                                    clientName === '' ||
                                    billingAddress === '' ||
                                    street === '' ||
                                    city === '' ||
                                    state === '' ||
                                    postalCode === '' ||
                                    country === '' ||
                                    panNumber === '' ||
                                    gstin === ''
                                }
                                variant="primary"
                                onClick={() => setCurrentStep(2)}>
                                Next
                            </Button>
                        </div>
                    </>
                    : <>
                        <h4 className='text-start w-100 mt-3'>Representative Details</h4>
                        <Form.Group className='text-start w-49' controlId="contactPerson">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control
                                type="text"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Contact person.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49' controlId="contactEmail">
                            <Form.Label>Contact Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Contact email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49 ' controlId="contactNumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Contact number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='text-start w-49 ' controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a Password.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="w-100 mt-3 text-end">
                            <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                                Back
                            </Button>
                            <Button
                                disabled={
                                    contactPerson === "" ||
                                    contactEmail === "" ||
                                    contactNumber === "" ||
                                    password === ""
                                }
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

export default CreateClientComponent;