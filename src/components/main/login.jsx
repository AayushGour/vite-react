import React, { useState } from 'react';
import "./login.scss";
import LoginImg from "../../assets/img/login-img-2.png";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginComponent = (props) => {

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(emailId, password);
        localStorage.setItem('token', true);
        navigate('/')
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
                <Form onSubmit={handleSubmit} className='login-form w-50 h-100 px-5 d-flex flex-column justify-content-center gap-3'>
                    <h3 className='login-title'>Login</h3>
                    <Form.Group className='text-start' controlId='emailId'>
                        <Form.Label>Email ID</Form.Label>
                        <Form.Control onChange={(e) => setEmailId(e?.target?.value)} type='email' placeholder='Email ID' />
                    </Form.Group>
                    <Form.Group className='text-start' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={(e) => setPassword(e?.target?.value)} type='password' placeholder='Password' />
                    </Form.Group>
                    <Button type='submit' className='mt-3'>LOGIN</Button>
                </Form>
            </div>
        </div>
    )
}

export default LoginComponent;