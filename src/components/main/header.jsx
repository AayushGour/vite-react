import React from 'react';
import "./header.scss";
import ECLogo from "../../assets/img/ec-logo.png";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = (props) => {
    const navigate = useNavigate();

    const logoutUser = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="main-header">
            <div className="header-content">
                <a href="/" className='h-100 d-flex flex-column justify-content-center'>
                    <img src={ECLogo} className='app-logo h-80' />
                </a>
                <Dropdown className='ms-auto'>
                    <Dropdown.Toggle >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={logoutUser}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default HeaderComponent;