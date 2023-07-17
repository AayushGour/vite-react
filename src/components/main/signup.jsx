import React, { useState } from 'react';

import { Button, Form, Spinner } from 'react-bootstrap';
import ECLogo from "../../assets/img/ec-logo.png";
import LoginImg from "../../assets/img/login-img-2.jpg";
import { Link, useNavigate } from 'react-router-dom';
import "./login.scss";
import { signUpUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignupComponent = (props) => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ emailId: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        const config = {
            url: signUpUrl,
            method: "post",
            data: {
                emailId, password, roles: ["USER"]
            }
        }
        axios(config).then((resp) => {
            toast.success(resp?.data?.data?.message);
            navigate("/login");
        }).catch((e) => {
            console.error(e)
            toast.error(e?.response?.data?.message)
        }).finally(() => {
            setIsLoading(false);
        })
    }



    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!emailId) {
            newErrors.emailId = 'Email ID is required';
            isValid = false;
        } else {
            newErrors.emailId = '';
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Password must be 8 characters long and must contains at least one uppercase, lowercase and special character";
            isValid = false;
        } else {
            newErrors.password = '';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        } else {
            newErrors.confirmPassword = '';
        }

        setErrors(newErrors);
        return isValid;
    }


    return (
        <div className='login-page h-100 w-100'>
            <div className='login-background'></div>
            <div className='login-content-container d-flex flex-row align-items-center overflow-hidden'>
                <img className='login-img' src={LoginImg} />
                <Form noValidate onSubmit={handleSignup} className='login-form w-50 h-100 px-5 d-flex flex-column justify-content-start gap-2'>
                    <img className='mx-auto mt-5 mb-3 h-8' src={ECLogo} />
                    <h3 className='login-title'>Signup</h3>
                    <Form.Group className='text-start' controlId="formEmail">
                        <Form.Label>Email ID</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={emailId}
                            isInvalid={!!errors?.emailId}
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            required
                            onChange={(e) => setEmailId(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.emailId}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className='text-start' controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            required
                            isInvalid={!!errors?.password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className='text-start' controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={!!errors?.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>

                    <Button disabled={isLoading} className='login-btn mt-3 d-flex flex-row gap-3 justify-content-center align-items-center' variant="primary" type="submit" onClick={validateForm}>
                        SIGN UP {isLoading ? <Spinner animation="border" /> : <></>}
                    </Button>
                    <div className="w-100 text-center">
                        <span>Already have an account?</span>
                        <Link className='ms-2' to="login">Login</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default SignupComponent;