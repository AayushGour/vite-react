import React from 'react';
import "./header.scss";
import ECLogo from "../../assets/img/ec-logo.png";
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';

const HeaderComponent = (props) => {
    const navigate = useNavigate();

    const logoutUser = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    }

    const items = [
        {
            key: '1',
            label: (
                <span style={{ fontSize: "1rem" }} onClick={logoutUser} >
                    <svg xmlns="http://www.w3.org/2000/svg" className='me-2' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" /></svg>
                    Logout
                </span>
            ),
        },
    ];


    return (
        <div className="main-header">
            <div className="header-content">
                <a href="/" className='h-100 d-flex flex-column justify-content-center'>
                    <img src={ECLogo} className='app-logo h-80' />
                </a>
                <Dropdown className='ms-auto' menu={{ items }} trigger={['click', 'hover']}>
                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </a>
                </Dropdown>
                {/* <Dropdown className='ms-auto'>
                    <Dropdown.Toggle >
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={logoutUser}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}
            </div>
        </div>
    )
}

export default HeaderComponent;