import React, { useState } from 'react';
import "./login.scss";
import LoginImg from "../../assets/img/login-img-2.jpg";
import ECLogo from "../../assets/img/ec-logo.png";
import { Button, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { loginUrl } from '../utility/api-urls';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginComponent = (props) => {

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ emailId: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsLoading(true);
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            const config = {
                url: loginUrl,
                method: "post",
                data: {
                    emailId, password
                }
            }
            axios(config).then((resp) => {
                const { data } = resp.data;
                localStorage.setItem('token', data?.token);
                localStorage.setItem('refreshToken', data?.refreshToken);
                localStorage.setItem('roles', data?.roles);
                sessionStorage.setItem('counter', 0);
                if (data?.agencyId) {
                    localStorage.setItem('agencyId', data?.agencyId);
                }
                navigate('/')
            }).catch((e) => {
                console.error(e);
                toast.error("Invalid username or password");
            }).finally(() => {
                setIsLoading(false);
            })
        } else {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!pattern.test(emailId)) {
                setErrors({ ...errors, emailId: "Invalid Email ID" })
            }
            setIsLoading(false);
        }
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

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else {
            newErrors.password = '';
        }

        setErrors(newErrors);
        return isValid;
    }

    return (
        <div className='login-page h-100 w-100'>
            <div className='login-background'></div>
            {/* <div style={{ background: "#5DA2FF", height: "100px", width: "100px", boxShadow: "0px 0px 5px #0008" }}></div>
            <div style={{ background: "#5AA0FF", height: "100px", width: "100px", boxShadow: "0px 0px 5px #0008" }}></div>
            <div style={{ background: "#519DFF", height: "100px", width: "100px", boxShadow: "0px 0px 5px #0008" }}></div>
            <div style={{ background: "#4193FF", height: "100px", width: "100px", boxShadow: "0px 0px 5px #0008" }}></div>
            <div style={{ background: "#2281FF", height: "100px", width: "100px", boxShadow: "0px 0px 5px #0008" }}></div>
            <div style={{ background: "#010B6C", height: "100px", width: "100px", boxShadow: "0px 0px 5px #0008" }}></div> */}
            <div className='login-content-container d-flex flex-row align-items-center overflow-hidden'>
                <img className='login-img' src={LoginImg} />
                <Form noValidate onSubmit={handleSubmit} className='login-form w-50 h-100 px-5 d-flex flex-column justify-content-start gap-3'>
                    <img className='mx-auto my-5 h-10' src={ECLogo} />
                    <h3 className='login-title'>Login</h3>
                    <Form.Group className='text-start' controlId='emailId'>
                        <Form.Label>Email ID</Form.Label>
                        <Form.Control
                            onChange={(e) => setEmailId(e?.target?.value)}
                            isInvalid={!!errors?.emailId}
                            type='email'
                            placeholder='Email ID'
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            value={emailId}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.emailId}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='text-start' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={(e) => setPassword(e?.target?.value)}
                            type='password'
                            isInvalid={!!errors?.password}
                            placeholder='Password'
                            required
                            value={password}
                        />
                        <Form.Control.Feedback type="invalid">{errors?.password}</Form.Control.Feedback>
                    </Form.Group>
                    <Button disabled={isLoading} type='submit' className='login-btn mt-3 d-flex flex-row gap-3 justify-content-center align-items-center' onClick={validateForm}>LOGIN {isLoading ? <Spinner animation="border" /> : <></>}</Button>
                    <div className="w-100 text-center">
                        <span>Don't have an account?</span>
                        <Link className='ms-2' to='/signup'>Signup</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default LoginComponent;